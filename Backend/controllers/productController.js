const Product = require('../model/productModel.js');
const fs = require('fs');

const createProductController = async (req, res) => {
    const { productName, description, category, shipping, price,quantity, size, dimension,minDelivery,maxDelivery } = req.fields;
    const { image } = req.files;
    try {
        // Validation
        switch (true) {
           
            case image && image.size > 1000000:
                return res.status(500).send({ error: 'Photo size is too large' });
        }

        const products = new Product({productName,
            description,
            category,
            shipping,
            price,
            quantity,
            size,
            dimension,
            minDelivery,
            maxDelivery});

        // Check if image exists
        if (image) {
            try {
                products.image.data = fs.readFileSync(image.path);
                products.image.contentType = image.type;
                console.log('Image Type:', image.type);
            } catch (readFileError) {
                console.error('Error reading file:', readFileError);
                return res.status(500).json({ error: 'Failed to read image file' });
            }
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

//get products
const getProductController = async (req, res) => {
    
    try {
       const products = await Product.find({}).select("-image").limit(12).sort({createdAt:-1}).populate('category');
       res.status(200).json({ 
        success: true,
        total : products.length,
        message: 'All Products',
        products,
       
        });
        
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error: err.message,
        });
    }
};


const getProductByCategoryController = async (req, res) => {
    
    try {
        const categoryId = req.params.cid;
        console.log(categoryId);
        const products = await Product.find({ category: categoryId}).select("-image");
        console.log("products",products);
        res.status(200).json({ 
        success: true,
        total : products.length,
        message: 'Products by category',
        products,
       
        });
        
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({
            success: false,
            message: 'Error in sending product',
            error: err.message,
        });
    }
};

//get single product by ID
const getSingleProductController = async (req, res) => {
    console.log('Request received for product ID:', req.params.id);
    try {
        const product = await Product.findById(req.params.id).select("-image").populate('category');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Product details',
            product,
        });
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error in fetching product',
            error: err.message,
        });
    }
};


//get photo
const getPhotoController = async (req, res) => {
    
    try {
       // console.log("PID",req.params.pid);
       const products = await Product.findById(req.params.pid).select("image");
       if(products.image.data){
        res.set('Content-type', products.image.contentType);
        return res.status(200).send(products.image.data);
    }
       res.status(200).json({ 
        success: true,
        total : products.length,
        message: 'All Products',
        products,
       
        });
        
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error: err.message,
        });
    }
};

// Delete category by ID
const deleteProductController = async (req, res) => {
    try {
        const productId = req.params.id;
  
        console.log('Received DELETE request for product ID:', productId);
        // Perform the delete operation
        const deletedProduct = await Product.findByIdAndDelete(productId);
  
        if (deletedProduct) {
            return res.json({ message: 'Product deleted successfully', deletedProduct  });
        } else {
          console.log('Category not found:', productId);
            return res.status(404).json({ error: 'Failed to delete category' });
        }
    } catch (error) {
        console.error("error : ",error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



// Update a specific product partially using put
const updateProductController = async (req, res) =>  {
    
    try {
        const { pid } = req.params;
        const { productName, description, category, shipping, price,quantity, size, dimension,minDelivery,maxDelivery} = req.fields;
        const { image } = req.files;
        
        const products = await Product.findByIdAndUpdate(pid,{
            productName,
            description,
            category,
            price,
            quantity,
            size,
            dimension,
            shipping,
            minDelivery,
            maxDelivery,
        }, { new: true });
        
       

        // Check if image exists
        if (image && image.length > 0) {
            try {
                products.image.data = fs.readFileSync(image.path);
                products.image.contentType = image.type;
                console.log('Image Type:', image.type);
            } catch (readFileError) {
                console.error('Error reading file:', readFileError);
                return res.status(500).json({ error: 'Failed to read image file' });
            }
        }

        // Save the product
        const savedProduct = await products.save();
        if (savedProduct) {
            return res.status(201).json({ success: true, message: 'Product updated',products: savedProduct });
          } else {
            return res.status(500).json({ error: 'Failed to save product' });
          }
    
    } catch (error) {
        console.error('Error console:', error);
        res.status(500).send({
            success: false,
            error: error,
            message: 'Error in updating product',
        });
    }
};
const updateProductQuanityController = async (req, res) => {
    try {
        const { pid } = req.params;
        const { quantity } = req.body;
        console.log('Received PUT request for product ID:', pid, 'with quantity:', quantity);
        // Update only the quantity of the product
        const updatedProduct = await Product.findByIdAndUpdate(pid, { quantity }, { new: true });

        if (updatedProduct) {
            return res.status(200).json({ success: true, message: 'Product quantity updated', product: updatedProduct });
        } else {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ success: false, error: 'Failed to update product quantity' });
    }
};


  
module.exports = {createProductController,getProductController,getPhotoController,getSingleProductController,deleteProductController,updateProductController,getProductByCategoryController,updateProductQuanityController  };
