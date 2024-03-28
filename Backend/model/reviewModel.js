const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }, 
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  review: { type: String, required: false },
  createdAt: { type: Date, default: Date.now } 
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;