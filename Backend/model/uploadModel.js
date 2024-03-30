const mongoose = require('mongoose');
const uploadSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    imagePath: { type: String, required: true },
    imageData: {
        type: Buffer, // Store image data as binary data
        required: true
      },
    uploadDate: { type: Date, default: Date.now },
    // Other fields related to the upload
});
const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;