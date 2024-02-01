const mongoose = require('mongoose');

    const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.ObjectId,
        ref: 'Product', // Reference to the Product model if you have one
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, // Default quantity is 1
    },
    });

    const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'User', // Reference to the User model if you have one
    },
    items: [cartItemSchema], // An array of cart items
    });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
