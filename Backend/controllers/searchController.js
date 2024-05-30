const Product = require('../model/productModel.js');
const fs = require('fs');

//search products
const searchController = async (req, res) => {
    
    try {
        const {keyword} = req.params;
        console.log('Search keyword:', keyword);
       const result = await Product.find({
        $or:[
            {productName:{
                $regex:keyword, $options:"i"    // insensitive to uppercase and lowercase
            }}
        ]
       }).select("-image");

       res.json({ 
        success: true,
        result,
       
        });
        
        
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send({
            success: false,
            message: 'Error in searching product',
            error: err.message,
        });
    }
};
module.exports = {searchController};
