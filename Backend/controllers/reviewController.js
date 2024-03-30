const User = require('../model/userModel');
const Product = require('../model/productModel');
const Review = require('../model/reviewModel'); 

const createReviewController = async (req, res) => {
    try {
        const { user,product ,rating, review  } = req.body;
        
        console.log(req.body);
        console.log(product);
        const products = await Product.findById(product);
        if (!products) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        
        const newReview = new Review({
            user: user,
            product: product,
            rating,
            review
        });
        
        await newReview.save();
        res.status(201).json({
            success: true,
            message: 'Review added successfully',
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error in creating review',
            error: err.message,
        });
    }
};
const getReviewController = async (req, res) => {
    try {
        const productId = req.params.productId; 
        const reviews = await Review.find({ product: productId }).populate('user', 'name email'); 
        
        res.status(200).json({
            success: true,
            reviews: reviews
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error in fetching reviews',
            error: err.message
        });
    }
};
const getAllReviewController = async (req, res) => {
    try {
        
        const reviews = await Review.find().populate('user', 'name email'); 
        
        res.status(200).json({
            success: true,
            reviews: reviews
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error in fetching reviews',
            error: err.message
        });
    }
};

module.exports = { createReviewController, getReviewController,getAllReviewController};
