const FileUpload = require('../models/FileUpload');

// Save file to MongoDB
const saveFile = async (file, uploadedBy, relatedTo = 'general', relatedId = null) => {
  try {
    const fileDoc = await FileUpload.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
      uploadedBy,
      relatedTo,
      relatedId,
    });
    return fileDoc;
  } catch (err) {
    console.error('Error saving file:', err);
    throw err;
  }
};

// Get file from MongoDB
const getFile = async (fileId) => {
  try {
    const file = await FileUpload.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  } catch (err) {
    console.error('Error retrieving file:', err);
    throw err;
  }
};

// Delete file from MongoDB
const deleteFile = async (fileId) => {
  try {
    const file = await FileUpload.findByIdAndDelete(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
};

// Get all files for a specific related item
const getFilesByRelation = async (relatedTo, relatedId) => {
  try {
    const files = await FileUpload.find({
      relatedTo,
      relatedId,
    }).select('-data'); // Don't include buffer data in list
    return files;
  } catch (err) {
    console.error('Error retrieving files:', err);
    throw err;
  }
};

module.exports = {
  saveFile,
  getFile,
  deleteFile,
  getFilesByRelation,
};
