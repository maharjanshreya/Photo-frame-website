const User = require('../model/userModel');
const userController = async (req, res) => {
    //get user
    try {
        // Fetch all user details from the database
        const users = await User.find({ role: { $ne: 'admin' } }, { password: 0, cpassword: 0 }); // Excluding password field for security

        // Send the user details as the response
        res.json(users);
    } catch (error) {
        // Handle errors
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteUserController = async (req, res) => {
    try {
        const userId = req.params.userId;
  
        console.log('Received DELETE request for user ID:', userId);
        // Perform the delete operation
        const deletedUser = await User.findByIdAndDelete(userId);
  
        if (deletedUser) {
            return res.json({ message: 'User deleted successfully', deletedUser  });
        } else {
          console.log('User not found:', deletedUser);
            return res.status(404).json({ error: 'Failed to delete the user.' });
        }
    } catch (error) {
        console.error("error : ",error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const  updateUserController = async (req, res) =>  {
    
    try {
        const { userId } = req.params;
        const { firstname,lastname,email,contact} = req.body;
        console.log('Received PUT request for user ID:', firstname);
        const products = await User.findByIdAndUpdate(userId,{
            firstname,
            lastname,
            email,
            contact,
        }, { new: true });
        
       
        // Save the product
        const savedUsers = await products.save();
        if (savedUsers) {
            return res.status(201).json({ success: true, message: 'user updated',users: savedUsers });
          } else {
            return res.status(500).json({ error: 'Failed to update user' });
          }
    
    } catch (error) {
        console.error('Error console:', error);
        res.status(500).send({
            success: false,
            error: error,
            message: 'Error in updating user',
        });
    }
};
  module.exports = { userController, deleteUserController, updateUserController};