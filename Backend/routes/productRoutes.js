const express = require('express');
const router = express.Router();
const formidable = require('express-formidable');
const authenticate = require("../middleware/authenticate");
const Product = require('../model/productModel.js');
const  {createProductController}  = require('../controllers/productController.js');
// Function to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.rootUser && req.rootUser.role === 'admin') {
        // User has admin role, proceed to the next middleware/route handler
        next();
    } else {
        // User does not have admin role, send a 403 Forbidden response
        res.status(403).send('Unauthorized: Admin access required');
    }
};


// router.post('/products', formidable, async (req, res) => {
//     try {
//       const newProduct = await Product.create(req.body);
//       res.json(newProduct);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// Create products
router.post('/products',formidable(), createProductController);



module.exports = router;