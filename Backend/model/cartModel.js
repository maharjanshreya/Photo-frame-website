const mongoose = require('mongoose');

    const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.ObjectId,
        ref: 'Product', 
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, 
    },
    size: {
        type: String, 
        required: true,
    },
    
    uploadId:{
        type: mongoose.ObjectId,
        ref: 'Upload', 
        
    }
    });
    
    const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'User',
    },
    items: [cartItemSchema], 
    });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
