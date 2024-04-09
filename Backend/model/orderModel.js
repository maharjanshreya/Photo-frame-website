const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
});
const shippingDetailsSchema = new mongoose.Schema({
    address: {
      city: { type: String, required: true },
      country: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String },
      postal_code: { type: String, required: true },
      state: { type: String }
    },
    name: { type: String, required: true }
  });
  

const orderSchema = new mongoose.Schema({
    products:[productSchema],
    shippingAddress: shippingDetailsSchema,
    payment:{},
    buyer:{
        type: mongoose.ObjectId,
        ref: "User",    
    },
    status:{
        type: String,
        default: "Processing",
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"]
    },
    },
{timestamps: true}
);

//collection creation
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;