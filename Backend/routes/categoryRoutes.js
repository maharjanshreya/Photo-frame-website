const express = require('express');
const router = express.Router();
const Category = require('../model/categoryModel');
const { ObjectId } = require('mongodb');
// Create category for products
router.post('/category', async (req, res) => {
    try {
      const newCategory = await Category.create(req.body);
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Get all users

router.get('/category', async (req, res) => {
  try {
    const cat = await Category.find();
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});



module.exports = router;