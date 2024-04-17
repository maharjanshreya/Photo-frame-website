const Cart = require('../model/cartModel');
const Product = require('../model/productModel'); 
const Upload = require('../model/uploadModel'); 
const mongoose = require('mongoose');

const cartController = async (req, res) => {
  const userId = (req.body.userId);
  try {
    const items = req.body.items;
    console.log(items);
    const productIdd = (items[0].productId);
    //console.log(userId);
    //console.log(productIdd);
    const quantity = items[0].quantity;
    const size = items[0].size;
    const uploadId = items[0].uploadId;
    console.log("Size", size);
    const isValidProduct = await Product.exists({ _id: productIdd });
    if (!isValidProduct) {
      return res.status(404).json({ success: false, message: 'Invalid Product ID' });
    }
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      // If the user doesn't have a cart, create a new one
      const newCart = new Cart({
        userId,
        items: [{ productId: productIdd, quantity, size, uploadId}]
      });
      await newCart.save();
      return res.status(200).json({ success: true, message: 'Product added to cart successfully', cart: newCart });
    }
    //check if the product already exists in cart for that user
    //if exits then only increase the quantity
    //else create a new item to the cart

    const existingItem = userCart.items.find(item => item.productId._id.toString() === productIdd.toString());

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      userCart.items.push({ productId: productIdd, quantity, size , uploadId});
    }
    await userCart.save();// Save the updated cart
    console.log("User cart: ",userCart);
    res.status(200).json({ success: true, message: 'Product added to cart successfully', cart: userCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

//get my cart
const getCartController = async (req, res) => {

  try {
    const userId = req.params.id;
    const userCart = await Cart.findOne({ userId }).populate('items.productId');

    if (!userCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    console.log("User cart in get: ",userCart) 

    res.status(200).json({ success: true, message: 'Cart retrieved successfully', cart: userCart });
    //console.log("User cart: ",userCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Remove item from the cart
const removeCartController = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'Invalid input parameters' });
    }
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Remove the item from the cart
    userCart.items = userCart.items.filter(item => item.productId.toString() !== productId);
    await userCart.save();
    return res.status(200).json({ success: true, message: 'Item removed from the cart', cart: userCart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { cartController, getCartController, removeCartController };

