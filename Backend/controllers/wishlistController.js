const Cart = require('../model/cartModel'); // Import the Cart model
const Product = require('../model/productModel'); // Import the Product model
const Wishlist = require('../model/wishlistModel');
const mongoose = require('mongoose');
const addToWishlistController = async (req, res) => {
    const { userId } = req.params;
    
    try {
        // Find the user's wishlist or create one if it doesn't exist
        let userWishlist = await Wishlist.findOne({ userId });
  
        if (!userWishlist) {
            userWishlist = new Wishlist({ userId, items: [] });
        }
  
        // Log the current state of the wishlist
        console.log('Current Wishlist:', userWishlist);

        // Extract items from the request body
        const items = req.body.items;
        console.log("Items: ",items);
        // Iterate through the items and add them to the wishlist
        for (const item of items) {
            const productIdd = item.productId;
            console.log("Product id is : ",productIdd);
            // Check if the product is already in the wishlist
            const isProductInWishlist = userWishlist.items.some(item => item.productId.toString() === productIdd.toString());

            if (!isProductInWishlist) {
                // Add the product to the wishlist
                userWishlist.items.push({ productId: productIdd });
            } else {
                console.log(`Product with ID ${productIdd} is already in the wishlist`);
                return res.status(400).json({
                    success: false,
                    message: `Product with ID ${productIdd} is already in the wishlist`,
                    wishlist: userWishlist
                });
            }
        }

        // Save the updated wishlist
        await userWishlist.save();

        // Log the updated state of the wishlist
        console.log('Updated Wishlist:', userWishlist);

        return res.status(201).json({ success: true, message: 'Products added to wishlist', wishlist: userWishlist });
    } catch (error) {
        console.error('Error adding products to wishlist:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getWishlistController = async (req, res) => {
    const { userId } = req.params.userId;
    
    try {
        // Find the user's wishlist
        const userWishlist = await Wishlist.findOne({ userId });

        if (!userWishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        // Log the current state of the wishlist
        console.log('Current Wishlist:', userWishlist);

        return res.status(200).json({ success: true, wishlist: userWishlist });
    } catch (error) {
        console.error('Error getting wishlist:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
  
  module.exports = { addToWishlistController,getWishlistController };