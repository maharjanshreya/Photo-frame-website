const User = require('../model/userModel');
const register = async (req, res) => {
    const { firstname, lastname, username, email, password, contact, role } = req.body;
    const userRole = role || "consumer";
    if (!firstname || !lastname || !username || !email || !password || !contact) {
        return res.status(422).json({ error: "fill all the properties" });
    }

    try {
        //left email = databse email 
        //right email: user writtten email
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });

        }
        
        else {
            const user = new User({ firstname, lastname, username, email, password, contact, role });
            const userRegister = await user.save();
            if (userRegister) {
                res.status(201).json({ message: "User resgister successfully" });
            }
            else {
                res.status(500).json({ error: "Failed tp registered" });
            }
        }
    } catch (err) {
        console.log("Error in checking user is exist or not", err);
    }
};
const userController = async (req, res) => {
    //get user
    try {
        const users = await User.find({ role: { $ne: 'admin' } }, { password: 0}); // Excluding password field for security

        res.json(users);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteUserController = async (req, res) => {
    try {
        const userId = req.params.userId;
        // console.log('Received DELETE request for user ID:', userId);
        const deletedUser = await User.findByIdAndDelete(userId);

        if (deletedUser) {
            return res.json({ message: 'User deleted successfully', deletedUser });
        } else {
            console.log('User not found:', deletedUser);
            return res.status(404).json({ error: 'Failed to delete the user.' });
        }
    } catch (error) {
        console.error("error : ", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUserController = async (req, res) => {

    try {
        const { userId } = req.params;
        const { firstname, lastname, email, contact } = req.body;
        console.log('Received PUT request for user ID:', firstname);
        const products = await User.findByIdAndUpdate(userId, {
            firstname,
            lastname,
            email,
            contact,
        }, { new: true });


        // Save the product
        const savedUsers = await products.save();
        if (savedUsers) {
            return res.status(201).json({ success: true, message: 'user updated', users: savedUsers });
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

const contactController = async (req, res) => {
    try {
        const { email, contact, message } = req.body;
        if (!email || !contact || !message) {
            console.log("Error in Contact form");
            return res.json({ error: "Please field the required fields" });
        }
        const userContact = await User.findOne({ _id: req.userID });
        if (userContact) {
            const userMessage = await userContact.addMessage(email, contact, message);
            await userContact.save();
            res.status(201).json({ message: "USer contact successfull" });
        }
    } catch (err) {
        console.log(err);
    }
};
const getAccountController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = { userController, deleteUserController, updateUserController, register,contactController,getAccountController};