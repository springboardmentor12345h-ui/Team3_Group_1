const mongoose = require('mongoose');
const crypto = require('crypto');

const forgotPasswordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour expiry
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Automatically delete expired tokens
forgotPasswordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
