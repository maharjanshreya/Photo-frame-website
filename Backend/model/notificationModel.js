const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    name: {
        type: String, required: true 
    }
});

//collection creation
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;