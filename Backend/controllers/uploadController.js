const Upload = require('../model/uploadModel'); 
const fs = require('fs');

const uploadController = async (req, res) => {
  const { imageData, userId } = req.body;
  console.log("Uset id: ",userId);
  // Decode base64-encoded image data to binary
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const imagePath = 'uploaded_image.png';
  fs.writeFile(imagePath, buffer, async (err) => {
    if (err) {
      console.error('Error saving image:', err);
      res.status(500).json({ success: false, error: 'Failed to save image' });
    } else {
      console.log('Image saved successfully:', imagePath);
      const newImage = new Upload({
        user: userId,
        imagePath: imagePath,
        imageData: buffer, 
      });

      try {
        const savedImage = await newImage.save();
        console.log('Image data saved to the database');
        res.status(200).json({ success: true, uploadId: savedImage._id });
      } catch (error) {
        console.error('Error saving image data to the database:', error);
        res.status(500).json({ success: false, error: 'Failed to save image data to the database' });
      }
    }
  });
};
const getImageByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
      const upload = await Upload.find({ user: userId });

      if (!upload) {
          return res.status(404).json({ error: 'Image data not found for the user' });
      }
      
      const imageDataArray = upload.map(upload => upload.imageData);
      res.status(200).json({ imageDataArray });
  } catch (error) {
      //console.error('Error retrieving image data:', error);
      res.status(500).json({ error: 'Failed to retrieve image data' });
  }
};
const getImageByUploadId = async (req, res) => {
  const uploadId = req.params.uploadId;

  try {
    const upload = await Upload.findById(uploadId);

    if (!upload) {
      return res.status(404).json({ error: 'Image data not found for the upload ID' });
    }

    // Send the image data in the response
    res.status(200).json({ imageData: upload.imageData });
  } catch (error) {
    //console.error('Error retrieving image data:', error);
    res.status(500).json({ error: 'Failed to retrieve image data' });
  }
};
module.exports = { uploadController,getImageByUserId,getImageByUploadId };
