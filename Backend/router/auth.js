const express = require('express');

const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());
const bcrypt = require('bcryptjs');
require('../db/conn');
const authenticate = require("../middleware/authenticate");
const User = require("../model/userModel");
const { useContext } = require('react');
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
        let token;
        const {email,password} = req.body;
        const userLogin = await User.findOne({email:email});
        console.log(userLogin);
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            res.cookie("jwtoken",token,{
              
                httpOnly:true,
            
            });
            if(!isMatch){
                res.status(400).json({error: "invalid credentials passsowrd"});
    
            }else{
                res.json({message: "user sign in successfully"});
            }
        }
        else{
            res.status(400).json({message: "Invalid credentials"});
  
        }
        
    }catch(err){
        console.log(err);

    }
});


router.get('/account', authenticate, (req,res)=>{
    console.log("Hello my account");
    res.send(req.rootUser);
    
});
router.get('/getData', authenticate, (req,res)=>{
    console.log("Contact page");
    res.send(req.rootUser);
    
});
router.get('/logout', authenticate, (req,res)=>{
    console.log("Log out user");
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("user log out successfully");
    
});

router.post('/contact', authenticate, async (req,res)=>{
    try{
        const {email,contact,message}= req.body;
        if(!email || !contact || !message){
            console.log("Error in Contact form");
            return res.json({error: "Please field the required fields"});
        }
        const userContact = await User.findOne({_id: req.userID});
        if(userContact){
            const userMessage = await userContact.addMessage(email,contact,message);
            await userContact.save();
            res.status(201).json({message:"USer contact successfull"}); 
        }
    }catch(err){
        console.log(err);
    }
  
    
});


module.exports = router;
  