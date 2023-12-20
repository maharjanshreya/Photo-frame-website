const express = require('express');
const router = express.Router();
require('../db/conn');
const User = require("../model/userModel");
router.get('/', (req, res) => {
    res.send("Hellosss world from router.js");
  });
router.post('/register', async(req, res)=>{
    const { firstname, lastname,username,email,password,cpassword,contact} = req.body;
    if(!firstname|| !lastname|| !username|| !email|| !password|| !cpassword|| !contact){
        return res.status(422).json({error:"fill all the properties"});
    }

    try{
        //left email = databse email right email: user writtten email
    const userExist =  await User.findOne({email: email})
    if(userExist){
        return res.status(422).json({error:"Email already exists"});

    }
    else if(password!= cpassword){
        return res.status(422).json({error:"password do not match"});
  
    }
    else{
        const user = new User({firstname, lastname,username,email,password,cpassword,contact});
        const userRegister = await user.save();
        if(userRegister){
            res.status(201).json({message: "User resgister successfully"});
        }
        else{
            res.status(500).json({error: "Failed tp registered"});
        }
    }
    

    }catch(err){
        console.log("Error in checking user is exist or not", err);
    }

   
});
// login route
router.post('/signin',async(req,res)=> {
   
    try{
        const {email,password} = req.body;
        const userLogin = await User.findOne({email:email});
        console.log(userLogin);
        if(!userLogin){
            res.status(400).json({error: "user error"});

        }else{
            res.json({message: "user sign in successfully"});
        }
    }catch(err){
        console.log(err);

    }
})
module.exports = router;
  