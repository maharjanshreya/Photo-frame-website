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
const { useContext } = require('react');
const { ObjectId } = require('mongodb');
const { searchController } = require('../controllers/searchController.js');
const { getNotification, createNotification } = require('../controllers/notificationController.js');
const { uploadController, getImageByUserId, getImageByUploadId } = require('../controllers/uploadController.js');
const { paymentController, handlePaymentSuccess } = require('../controllers/paymentController.js');
const { addToWishlistController, getWishlistController } = require('../controllers/wishlistController.js');
const { cartController, getCartController, removeCartController } = require('../controllers/cartController.js');
const { forgotController, resetController, postResetController } = require('../controllers/resetController.js');
const { getAllOrderController, getSingleOrderController, updateOrderController } = require('../controllers/orderController.js');
const { reportController, getReportController, replyToReportController, getReplyController } = require('../controllers/reportController.js');
const { createCategoryController, getCategoryController, updateCategoryController, deleteCategoryController } = require('../controllers/categoryController.js');
const { userController, deleteUserController, updateUserController, register, contactController, getAccountController } = require('../controllers/userController.js');
const { createReviewController, getReviewController, getAllReviewController, getHighestRatedProduct, getAllHighestRatedProducts } = require('../controllers/reviewController.js');
const { createProductController, getProductController, getPhotoController, getSingleProductController, deleteProductController, updateProductController } = require('../controllers/productController.js');

router.get('/', (req, res) => {
    res.send("Hellosss world from router.js");
});

// middleware for admin authentication
const isAdmin = (req, res, next) => {

    if (req.rootUser.role === 'admin') {
        next();
    } else {
        res.status(403).send("Forbidden: User is not an administrator");
    }
}

// middleware for consumer authentication
const isConsumer = (req, res, next) => {

    if (req.rootUser.role === 'consumer') {
        next();
    } else {
        res.status(403).send("unauthorized");
    }
}


//routes for login,register,logout,forgot password
router.post('/register', register);
// login route
router.post('/signin', async (req, res) => {

    try {
        let token;
        const { email, password } = req.body;
        const userLogin = await User.findOne({ email: email });


        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            res.cookie("jwtoken", token, {

                httpOnly: true,

            });
            if (!isMatch) {
                res.status(400).json({ error: "invalid_credentials", message: "Invalid credentials" });

            } else {
                res.json({
                    message: "user sign in successfully", userData: {
                        // Include any additional properties you want to send
                        userId: userLogin._id,
                        email: userLogin.email,
                        role: userLogin.role,
                        // Add other properties as needed
                    },
                });
            }
        }
        else {
            res.status(400).json({ error: "no_user_found", message: "No user found with provided email" });

        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server_error", message: "Please try again  later." });
    }
});
router.post('/forgot-password', forgotController);
router.get('/reset-password/:id/:token', resetController);
router.post('/reset-password/:id/:token', postResetController);
router.get('/verified-password', (req, res) => {
    res.render('verified'); // Render the 'verified' view
});
router.get('/logout', authenticate, (req, res) => {
    console.log("Log out user");
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send("user log out successfully");
});

//route for user update delete
router.put('/user-update/:userId', authenticate, updateUserController);
router.delete('/delete-user/:userId', authenticate, isAdmin, deleteUserController);
router.get('/getUser', authenticate, isAdmin, userController);


//route for category
router.post('/category', createCategoryController);
router.get('/category', getCategoryController);
router.put('/category/:id', authenticate, isAdmin, updateCategoryController);
router.delete('/deletecategory/:id', authenticate, isAdmin, deleteCategoryController);


//route for product and image upload
router.post('/products', authenticate, formidable(), createProductController);
router.get('/products', getProductController);
router.get('/products/:id', getSingleProductController);
router.get('/product-image/:pid', getPhotoController);
router.delete('/deleteproduct/:id', authenticate, deleteProductController);
router.put('/product-update/:pid', formidable(), updateProductController);


//route for add to cart
router.post('/add-to-cart', authenticate, cartController);
router.get('/add-to-cart/:id', authenticate, getCartController);
router.delete('/remove-item/:userId/:productId', authenticate, removeCartController);


//route for add to wishlist
router.post('/add-to-wishlist', authenticate, addToWishlistController);
router.get('/add-to-wishlist/:userId', authenticate, isConsumer, getWishlistController);


//route for report 
router.post('/report', authenticate, reportController);
router.post('/report/reply', authenticate, replyToReportController);
router.get('/report', authenticate, getReportController);
router.get('/report/reply/:userId', authenticate, getReplyController);

//route for notification
router.post('/create-notification', authenticate, createNotification);
router.get('/notification/:userId', authenticate, getNotification);
router.put('/update-order/:orderId', authenticate, updateOrderController);


router.get('/account', authenticate, (req, res) => {
    res.send(req.rootUser);
});

router.get('/getData', authenticate, (req, res) => {
    //console.log("Contact page");
    res.send(req.rootUser);

});

router.get('/account/:userId', authenticate, getAccountController);
router.post('/contact', authenticate, contactController);
router.get('/search/:keyword', searchController);


//route for user upload main
router.post('/upload', authenticate, uploadController);
router.get('/getImage/:userId', getImageByUserId);
router.get('/getImage-upload/:uploadId', getImageByUploadId);

//route for payment
router.get('/handle-success/:session_id', authenticate, handlePaymentSuccess);
router.post('/create-checkout-session', authenticate, paymentController);

//route for order get
router.get('/view-order', authenticate, getAllOrderController);
router.get('/view-my-orders/:buyerId', authenticate, getSingleOrderController);

//route for revire and rating 
router.post('/give-review', createReviewController);
router.get('/get-review/:productId', getReviewController);
router.get('/get-all-review', getAllReviewController);


//route for highest rated product
router.get('/highest-rate-product', getHighestRatedProduct);
router.get('/all-highest-rate-product', getAllHighestRatedProducts);


module.exports = router;
