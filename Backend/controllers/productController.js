const Product = require('../model/productModel.js');
const fs = require('fs');


const createProductController = async (req, res) => {
    const { productName, description, category, shipping, price, size, dimension } = req.fields;
    const { image } = req.files;
    try {
       

        // Validation
        switch (true) {
            case !productName:
                return res.status(500).send({ error: 'Name is Required' });
            case !description:
                return res.status(500).send({ error: 'Description is Required' });
            case image && image.size > 1000000:
                return res.status(500).send({ error: 'Photo size is too large' });
        }

        const products = new Product({productName,
            description,
            category,
            shipping,
            price,
            size,
            dimension, });

        // Check if image exists
        if (image) {
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
            console.log('Image Type:', image.type);
        }

        // Save the product
        const savedProduct = await products.save();
        if (savedProduct) {
            return res.status(201).json({ message: 'Product added', product: savedProduct });
          } else {
            return res.status(500).json({ error: 'Failed to save product' });
          }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({
            success: false,
            error: err,
            message: 'Error in creating product',
        });
    }
};

module.exports = createProductController;
