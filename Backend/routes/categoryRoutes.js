const express = require('express');
const router = express.Router();
const Category = require('../model/categoryModel');
// Create category for products
router.post('/category', async (req, res) => {
    try {
      const newCategory = await Category.create(req.body);
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;