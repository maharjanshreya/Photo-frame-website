const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
});

const orderSchema = new mongoose.Schema({
    products:[productSchema],
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