const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: "Product", 
    },],
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