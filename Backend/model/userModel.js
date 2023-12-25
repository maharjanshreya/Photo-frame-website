// models/user.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generatePath } = require('react-router-dom');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
  contact: { type: String, required: true},
  role: { type: String, default: "consumer" },
  date: {type: Date, default:Date.now},
  messages: [{
    email: { type: String, unique: true, lowercase: true, trim: true },
    contact: { type: String, required: true},
    message: { type: String, required: true}
  }],

  tokens: [{token:  { type: String, required: true} }]
});

userSchema.pre('save', async function(next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

//generating token
userSchema.methods.generateAuthToken = async function(){
  try{
    let token = jwt.sign({ _id: this._id}, process.env.SECRET_KEY);//payload which needs to be unique i.e id
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token; 
  }catch(err){
    console.log(err);
  }
}

//store the inquiry message

userSchema.methods.addMessage = async function(email, contact, message) {
  try {
      this.messages = this.messages.concat({ email, contact, message });
      await this.save();
      return this.messages;
  } catch (error) {
      console.log(error);
  }
}

//collection creation
const User = mongoose.model('User', userSchema);

module.exports = User;