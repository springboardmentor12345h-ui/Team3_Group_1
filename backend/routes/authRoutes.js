const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPasswordSendOTP, forgotPasswordVerifyOTP, forgotPasswordResetPassword } = require('../controllers/authController');
const { updateProfile, getProfile, checkProfileComplete } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

// Password Recovery Routes (OTP-based)
router.post('/forgot-password/send-otp', forgotPasswordSendOTP);
router.post('/forgot-password/verify-otp', forgotPasswordVerifyOTP);
router.post('/forgot-password/reset-password', forgotPasswordResetPassword);

// User Profile Routes
router.put('/profile/update', auth, updateProfile);
router.get('/profile', auth, getProfile);
router.get('/profile/check', auth, checkProfileComplete);

module.exports = router;
