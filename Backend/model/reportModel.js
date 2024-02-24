const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  adminReply: [
    {
      replyText: {
        type: String,
        required: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



reportSchema.methods.addMessage = async function (replyText, createdAt) {
  try {
    if (replyText && createdAt) {
      this.adminReply = this.adminReply.concat({ replyText, createdAt });
      await this.save();
    }
    return this.adminReply;
  } catch (error) {
    console.log(error);
    throw error; // Make sure to rethrow the error so that it's propagated
  }
}

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
