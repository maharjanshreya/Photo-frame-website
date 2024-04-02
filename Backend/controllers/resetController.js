const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
const forgotController = async (req, res) => {

    //get user
    try {
        const {email} = req.body;
        console.log(email);
        const oldUser = await User.findOne({ email: email });
        
        if (!oldUser){ 
            console.log("User doesn't exist");
            return res.status(404).json({ message: "User doesn't exist" });
        }

        //generate new password and save it
        const secret  = process.env.SECRET + oldUser.password;
        const token = jwt.sign({email: oldUser.email,id: oldUser._id}, secret, { expiresIn: '1h' });
        const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS
            }
          });
          
          var mailOptions = {
            from: 'SamanPhotoFrame@gmail.com',
            to: 'shreeya.maharjan4123@gmail.com',
            subject: 'Password Reset',
            text: link,
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
                res.send({message: "We have sent a link to your email to reset your password."});
              console.log('Email sent: ' + info.response);
            }
          });
        console.log("Link : ",link);
        
    } catch (error) {
        // Handle errors
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const resetController = async (req, res) => {

    const{id,token} = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
        
        if (!oldUser){ 
            console.log("User doesn't exist");
            return res.status(404).json({ message: "User doesn't exist" });
        }
        const secret  = process.env.SECRET + oldUser.password;
        try {
            const verify = jwt.verify(token, secret);
            res.render("index",{email:verify.email});
            
        } catch (error) {
            res.send("Not verified");
            
        }
 
};
const postResetController = async (req, res) => {

    const{id,token} = req.params;
    const {password} = req.body;
    const oldUser = await User.findOne({ _id: id });
        
        if (!oldUser){ 
            console.log("User doesn't exist");
            return res.status(404).json({ message: "User doesn't exist" });
        }
        const secret  = process.env.SECRET + oldUser.password;
        try {
            const verify = jwt.verify(token, secret);
            const encryptedPassword = await bcrypt.hash(password, 12);
            await User.updateOne(
                {_id:id} ,{ $set:  {
                 password : encryptedPassword },});
            res.json({status:"Password updated"});
            
            
        } catch (error) {
            console.log(error);
            res.send("Not verified");
            
        }
 
};
module.exports = { forgotController,resetController,postResetController};