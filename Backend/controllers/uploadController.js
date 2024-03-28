const uploadController = async (req, res) => {
    const { imageData, user } = req.body;
  
    // Process and store image data and user information
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const imagePath = 'images/image.png';
  
    fs.writeFile(imagePath, base64Data, 'base64', (error) => {
      if (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ success: false, error: 'Failed to save image' });
      } else {
        console.log('Image saved successfully');
        // Assuming you save user information to a database
        saveUserToDatabase(user);
  
        res.status(200).json({ success: true, imagePath });
      }
    });
  };
  
  // Function to save user information to the database
  function saveUserToDatabase(user) {
    // Your logic to save user information to the database
    console.log('Saving user to the database:', user);
  }
module.exports = {uploadController};