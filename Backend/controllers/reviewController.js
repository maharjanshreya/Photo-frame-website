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

const getHighestRatedProduct = async (req, res) => {
  try {
    const aggregateResult = await Review.aggregate([
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { averageRating: -1 } // Sort products by average rating in descending order
      },
      {
        $limit: 1 // Limit to the first result, which will be the highest rated product
      }
    ]);

    if (aggregateResult.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }

    const highestRatedProduct = aggregateResult[0];

    // Fetch additional details of the highest rated product
    const productDetails = await Product.findById(highestRatedProduct._id);

    // Calculate overall rating for the highest rated product only
    const overallRatingAggregate = await Review.aggregate([
      {
        $match: { product: highestRatedProduct._id } // Match reviews for the highest rated product
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const overallRating = overallRatingAggregate.length > 0 ? overallRatingAggregate[0].averageRating : null;

    // Include both highest rated product details and overall rating in response
    res.status(200).json({ productDetails, overallRating });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

  

module.exports = { createReviewController, getReviewController,getAllReviewController,getHighestRatedProduct};
