const express = require('express');

const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());
const bcrypt = require('bcryptjs');
require('../db/conn');
const authenticate = require("../middleware/authenticate");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const { useContext } = require('react');
router.get('/', (req, res) => {
    res.send("Hellosss world from router.js");
  });
router.post('/register', async(req, res)=>{
    const { firstname, lastname,username,email,password,cpassword,contact,role} = req.body;
    const userRole = role || "consumer";
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
        const user = new User({firstname, lastname,username,email,password,cpassword,contact,role});
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
// Get all category names
router.get('/category', async (req, res) => {
    
    try {
      const categories = await Category.find({}, 'name');
  
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: 'No categories found' });
      }
  
      const categoryNames = categories.map(category => category.name);
      console.log("Category Names:", categoryNames);
      res.json(categoryNames);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log("Error: in vcategories");
    }
});
router.post('/category', async (req, res) => {
    const {name} = req.body;
    if (!name) {
        return res.status(401).json({ message: 'Name is required' });
      }
    try {
      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        return res.status(200).json({ message: 'Category already exists' });
      }

      const newCategory = new Category({name});
      const savedCategory = await newCategory.save();

      if (savedCategory) {
        return res.status(201).json({ message: 'Category added', category: savedCategory });
      } else {
        return res.status(500).json({ error: 'Failed to save category' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
                res.json({message: "user sign in successfully",userData: {
                    // Include any additional properties you want to send
                    email: userLogin.email,
                    role: userLogin.role,
                    // Add other properties as needed
                },});
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
// router.get('/category', authenticate, (req,res)=>{
//     console.log("Category");
//     res.send(req.category);
    
// });
  // Get all products


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
  