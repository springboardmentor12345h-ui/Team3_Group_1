const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedTo: {
      type: String, // 'event', 'profile', etc.
      default: 'general',
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FileUpload', fileUploadSchema);
