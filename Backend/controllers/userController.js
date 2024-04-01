const User = require('../model/userModel');
const userController = async (req, res) => {
    //get user
    try {
        // Fetch all user details from the database
        const users = await User.find({}, '-password'); // Excluding password field for security

        // Send the user details as the response
        res.json(users);
    } catch (error) {
        // Handle errors
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };
  module.exports = { userController };