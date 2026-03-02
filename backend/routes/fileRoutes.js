const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const {
  uploadFile,
  downloadFile,
  getFileInfo,
  deleteFile,
} = require('../controllers/fileController');

// Upload a file
router.post('/upload', auth, upload.single('file'), uploadFile);

// Download a file
router.get('/download/:fileId', downloadFile);

// Get file info
router.get('/info/:fileId', getFileInfo);

// Delete a file
router.delete('/:fileId', auth, deleteFile);

module.exports = router;
