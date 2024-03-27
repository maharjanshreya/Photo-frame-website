const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const cookieParser = require("cookie-parser");
const formidable = require('express-formidable');
router.use(cookieParser());
const bcrypt = require('bcryptjs');
require('../db/conn');
const authenticate = require("../middleware/authenticate");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const {searchController}= require('../controllers/searchController.js');
const {cartController,getCartController, removeCartController}= require('../controllers/cartController.js');
const  {createProductController,getProductController,getPhotoController,getSingleProductController,deleteProductController,updateProductController}  = require('../controllers/productController.js');
const { useContext } = require('react');
const { ObjectId } = require('mongodb');
const { addToWishlistController,getWishlistController } = require('../controllers/wishlistController.js');
const {paymentController,handlePaymentSuccess} = require('../controllers/paymentController.js');
const { reportController,getReportController,replyToReportController,getReplyController} = require('../controllers/reportController.js');
const {getAllOrderController,getSingleOrderController,updateOrderController} = require('../controllers/orderController.js');

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
  
      const categoryData = categories.map(category => ({
        id: category._id,  
        name: category.name
      }));
      console.log("Category Data:", categoryData);
        res.json({ categories: categoryData });
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
        console.log("Category already exits");
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
                res.status(400).json({error: "invalid credentials "});
    
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
            res.status(400).json({message: "No user id"});
  
        }
        
    }catch(err){
        console.log(err);

    }
});


router.get('/account', authenticate, (req,res)=>{
    console.log("Hello my account");
    res.send(req.rootUser);
    
});

router.get('/account/:userId', authenticate, async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Assuming you are using a database and have a User model
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the authenticated user has permission to access this user's account
      // ...
  
      // Send the user details in the response
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// router.get('/category', authenticate, (req,res)=>{
//     console.log("Category");
//     res.send(req.category);
    
// });
  // Get all products


router.get('/getData', authenticate, (req,res)=>{
    //console.log("Contact page");
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

router.post('/products',formidable(), createProductController);
router.get('/products', getProductController);
router.get('/products/:id', getSingleProductController);
router.get('/product-image/:pid', getPhotoController);
router.delete('/deleteproduct/:id', deleteProductController);
router.put('/product-update/:pid',formidable(), updateProductController);


router.get('/search/:keyword', searchController);


router.post('/add-to-cart',authenticate, cartController);
router.get('/add-to-cart/:id',authenticate, getCartController);
router.delete('/remove-item/:userId/:productId',authenticate, removeCartController);


router.post('/add-to-wishlist', authenticate, addToWishlistController);
router.get('/add-to-wishlist/:userId', authenticate, getWishlistController);

router.post('/report', authenticate,reportController);
router.post('/report/reply',authenticate, replyToReportController);
router.get('/report',authenticate, getReportController);
router.get('/report/reply/:userId',authenticate, getReplyController);
router.get('/handle-success/:session_id',authenticate, handlePaymentSuccess);
router.post('/create-checkout-session',authenticate, paymentController);
router.get('/view-order',authenticate,getAllOrderController);
router.put('/update-order/:orderId',authenticate,updateOrderController); 
router.get('/view-my-orders/:buyerId',authenticate, getSingleOrderController);

// Update a specific category partially using PATCH
router.put('/category/:id', async (req, res) => {
    if(!req.body) {
        return res.status(422).json({message: 'req.body is null'});
    }
   
    try {
        const categoryId = req.params.id;
        const updates = req.body; // Updates should be sent as JSON in the request body

        const updatedCategory = await Category.findByIdAndUpdate(
            { _id: categoryId },
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not updated' });
        }
        console.log('Updated Category:', updatedCategory);
        res.json(updatedCategory);
    } catch (error) {
        console.log("MEssagejfnskfn");
        res.status(500).json({ error: error.message });
    }
});

  // Delete category by ID
router.delete('/deletecategory/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
  
        console.log('Received DELETE request for category ID:', categoryId);
        // Perform the delete operation
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
  
        if (deletedCategory) {
            return res.json({ message: 'Category deleted successfully', deletedCategory  });
        } else {
          console.log('Category not found:', categoryId);
            return res.status(404).json({ error: 'Failed to delete category' });
        }
    } catch (error) {
        console.error("error : ",error);
        return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  

module.exports = router;
  