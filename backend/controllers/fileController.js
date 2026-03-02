const { saveFile, getFile, deleteFile } = require('../services/fileService');

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file provided' });
    }

    const { relatedTo, relatedId } = req.body;

    const fileDoc = await saveFile(
      req.file,
      req.user.id,
      relatedTo || 'general',
      relatedId || null
    );

    res.json({
      msg: 'File uploaded successfully',
      fileId: fileDoc._id,
      filename: fileDoc.filename,
      size: fileDoc.size,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error uploading file' });
  }
};

// Download a file
exports.downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await getFile(fileId);

    res.set('Content-Type', file.mimetype);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.data);
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: 'File not found' });
  }
};

// Get file info (without buffer data)
exports.getFileInfo = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await getFile(fileId);

    res.json({
      _id: file._id,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: file.uploadedBy,
      createdAt: file.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: 'File not found' });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await getFile(fileId);

    // Check if user is the one who uploaded it or is admin
    if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this file' });
    }

    await deleteFile(fileId);

    res.json({ msg: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error deleting file' });
  }
};
