const Notification = require('../model/notificationModel'); 
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
module.exports = {getNotification};