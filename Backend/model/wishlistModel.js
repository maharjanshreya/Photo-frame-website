const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'User', 
        
    },
    items: [
      {
        productId: {
            type: mongoose.ObjectId,
            ref: 'Product', // Reference to the Product model if you have one
            required: true,
        }
      },
    ],
  });
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
