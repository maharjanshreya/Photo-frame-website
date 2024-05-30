const Notification = require('../model/notificationModel'); 
const User = require('../model/userModel'); 
const notifier = require('node-notifier');
const getNotification = async (req, res) => {
    const userId = req.params.userId;
    try {
        
        const notification = await Notification.find({ userId });
        res.json(notification);
    } catch (err) {
     
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const createNotification =  async (req, res) => {
    const { userId, message } = req.body;
    try {
       
        if (!userId) {
            return res.status(404).json({ success: false, message: 'User not found. Please select a user' });
        }

        const notification = new Notification({
            userId: userId,
            message: message
        });
        await notification.save();
        sendSoundNotification();
        res.status(201).json({ success: true, message: 'Notification sent Successfully' });

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const sendSoundNotification = () => {
    notifier.notify({
        title: 'New Notification',
        message: 'You have a new notification!',
        sound: true 
    });
};
module.exports = {getNotification,createNotification};