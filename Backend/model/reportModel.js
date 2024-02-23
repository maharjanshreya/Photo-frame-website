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
  adminReply: {
    type: [String], 
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.methods.addMessage = async function (adminReply) {
  try {
    console.log('Before save:', this.adminReply);

    // Filter out null values before pushing the new adminReply
    this.adminReply = (this.adminReply || []).filter((reply) => reply !== null);
    this.adminReply.push(adminReply);

    await this.save();

    console.log('After save:', this.adminReply);

    return this.adminReply;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// userSchema.methods.addMessage = async function(email, contact, message) {
//   try {
//       this.messages = this.messages.concat({ email, contact, message });
//       await this.save();
//       return this.messages;
//   } catch (error) {
//       console.log(error);
//   }
// }
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
