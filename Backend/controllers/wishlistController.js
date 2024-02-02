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
            const isProductInWishlist = userWishlist.items.some(item => item.equals(productIdd));

            if (!isProductInWishlist) {
                // Add the product to the wishlist
                userWishlist.items.push({ productId: productIdd });
            } else {
                console.log(`Product with ID ${productIdd} is already in the wishlist`);
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

  
  module.exports = { addToWishlistController };