const Cart = require('../model/cartModel'); // Import the Cart model
const Product = require('../model/productModel'); // Import the Product model
const mongoose = require('mongoose');
const cartController = async (req, res) => {
    const userId = (req.body.userId);
    
    try {   
        const items = req.body.items;
    const productIdd = ( items[0].productId);
    console.log(userId);
    console.log(productIdd);
    const quantity=  items[0].quantity;

    // Validate if productId is valid (optional step)
    const isValidProduct = await Product.exists({ _id: productIdd });
    if (!isValidProduct) {
      return res.status(404).json({ success: false, message: 'Invalid Product ID' });
    }

    // Create a new cart item
    const newCartItem = {
        productId: productIdd,
      quantity: Math.max(1, quantity), // Ensure quantity is at least 1
    };

    // Find the user's cart or create a new one if it doesn't exist
    const userCart = await Cart.findOneAndUpdate(
      { userId },
      { $addToSet: { items: newCartItem } }, // Use $addToSet to avoid duplicates
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Product added to cart successfully', cart: userCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

//get my cart
const getCartController = async (req, res) => {
    
  try {
    const userId = req.params.id; // Assuming the user ID is in the URL parameter

    // Find the user's cart
    const userCart = await Cart.findOne({ userId }).populate('items.productId');

    if (!userCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, message: 'Cart retrieved successfully', cart: userCart });
    console.log("User cart: ",userCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { cartController,getCartController };
