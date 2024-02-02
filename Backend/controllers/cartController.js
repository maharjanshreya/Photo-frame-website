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
     // Find the user's cart
     const userCart = await Cart.findOne({ userId });

     if (!userCart) {
       // If the user doesn't have a cart, create a new one
       const newCart = new Cart({
         userId,
         items: [{ productId: productIdd, quantity }]
       });
       await newCart.save();
       return res.status(200).json({ success: true, message: 'Product added to cart successfully', cart: newCart });
     }
 

    // Check if the product already exists in the cart
    const existingItem = userCart.items.find(item => item.productId._id.toString() === productIdd.toString());

    if (existingItem) {
      // If the product exists, update the quantity by adding the provided quantity
      existingItem.quantity += 1;
    } else {
      // If the product doesn't exist, add a new item to the cart
      userCart.items.push({ productId: productIdd, quantity });
    }
     // Save the updated cart
     await userCart.save();
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


// Remove item from the cart
const removeCartController = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Validate input parameters
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'Invalid input parameters' });
    }

    // Find the user's cart
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

      // Remove the item from the cart
      userCart.items = userCart.items.filter(item => item.productId.toString() !== productId);


    // Save the updated cart
    await userCart.save();

    return res.status(200).json({ success: true, message: 'Item removed from the cart', cart: userCart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { cartController, getCartController, removeCartController };


module.exports = { cartController,getCartController,removeCartController };
