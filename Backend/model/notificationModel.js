const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

//collection creation
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;