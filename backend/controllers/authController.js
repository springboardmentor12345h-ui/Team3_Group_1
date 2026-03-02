const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendForgotPasswordEmail, sendPasswordResetConfirmation } = require('../config/email');

exports.register = async (req, res) => {
  const { name, email, password, role, college } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: hash, role, college });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for password reset
exports.forgotPasswordSendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email || !email.trim()) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase().trim() });

    // Save new OTP
    await OTP.create({
      email: email.toLowerCase().trim(),
      otp,
    });

    // Send email
    try {
      await sendForgotPasswordEmail(user.email, otp);
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      return res.status(500).json({ msg: 'Failed to send OTP email. Please try again.' });
    }

    res.json({ msg: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error sending OTP' });
  }
};

// Verify OTP
exports.forgotPasswordVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ msg: 'Email and OTP are required' });
    }

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase().trim(),
      otp: otp.trim(),
      isUsed: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    res.json({ msg: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error verifying OTP' });
  }
};

// Reset password with OTP
exports.forgotPasswordResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: 'Email, OTP, and password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    // Verify OTP was used (already verified)
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase().trim(),
      otp: otp.trim(),
      isUsed: true,
    });

    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid OTP. Please request a new one.' });
    }

    // Get user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send confirmation email
    try {
      await sendPasswordResetConfirmation(user.email, user.name);
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }

    res.json({ msg: 'Password reset successfully. You can now login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error resetting password' });
  }
};
