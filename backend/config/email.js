const nodemailer = require('nodemailer');

// Configure your email service here
// For Gmail: Use app password (not regular password)
// For other services: Update accordingly
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('Email service is ready');
  }
});

const sendForgotPasswordEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - Your OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">Campus Event Hub</h1>
          <p style="color: #666; margin: 5px 0;">Password Reset</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            We received a request to reset your password. Use the OTP below to proceed with the password reset. This OTP is valid for 10 minutes.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 8px; color: white;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Your Verification Code</p>
              <p style="margin: 15px 0; font-size: 48px; font-weight: bold; letter-spacing: 10px; font-family: 'Courier New', monospace;">${otp}</p>
            </div>
          </div>
          
          <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            If you did not request this password reset, please ignore this email or contact support immediately. Your account will remain secure.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendPasswordResetConfirmation = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Successful',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">Campus Event Hub</h1>
          <p style="color: #666; margin: 5px 0;">Confirmation</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Successful</h2>
          
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            Hi ${name},
          </p>
          
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            Your password has been successfully reset. You can now login to your account with your new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Go to Login
            </a>
          </div>
          
          <p style="color: #955; font-size: 14px; background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>Warning:</strong> If you did not perform this action, please contact support immediately.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendForgotPasswordEmail,
  sendPasswordResetConfirmation,
};
