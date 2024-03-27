const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    productName: {
        type: String, required: true 
    },
    description: {
        type: String, required: true 
    },
    category:{
        type: mongoose.ObjectId,
        ref:'Category',
        required: true
    },
    image:{
        data: Buffer,
        contentType: String,

    },
    shipping:{
        type: Number,

    },
    price:{
        type: Number, required: true
    },
    quantity:{
        type:Number ,required :true
    },
    size:{
        type: String, required: true
    },
    dimension:{
        type: String, required: true
    },
    minDelivery: {
        type: Number, // Assuming this is in days
        required: true
    },
    maxDelivery: {
        type: Number, // Assuming this is in days
        required: true
    }
},
{timestamps: true}
);

//collection creation
const Product = mongoose.model("Product", productSchema);

module.exports = Product;