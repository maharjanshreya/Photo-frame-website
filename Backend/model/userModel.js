// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
  contact: { type: String, required: true}
});

userSchema.pre('save', async function(next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;