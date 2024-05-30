const Cart = require('../model/cartModel'); // Import the Cart model
const Product = require('../model/productModel'); // Import the Product model
const Wishlist = require('../model/wishlistModel');
const User = require('../model/userModel');
const mongoose = require('mongoose');
const addToWishlistController = async (req, res) => {

  try {
    const { userId, productId } = req.body;
    // Find the user's wishlist or create one if it doesn't exist
    let userWishlist = await Wishlist.findOne({ userId }).populate('user');
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product is already in the user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist && wishlist.products.includes(productId)) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // If the wishlist doesn't exist, create a new one
    if (!wishlist) {
      const newWishlist = new Wishlist({
        user: userId,
        products: [productId],
      });
      await newWishlist.save();
    } else {
      // Add the product to the existing wishlist
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(201).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding products to wishlist:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getWishlistController = async (req, res) => {


  try {
    const { userId } = req.params;
    // Check if the user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Find the user's wishlist
    const userWishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!userWishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }


    return res.status(200).json({ success: true, wishlist: userWishlist });
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { addToWishlistController, getWishlistController };