const express = require('express');
const router = express.Router();
const categoryModel = require('../model/categoryModel');
// Create category for products
router.post('/category', async (req, res) => {
    try {
      const {name} = req.body;
      if(!name){
        return res.status(401).send({message: 'Name is required'})
      }
      const existingCategory = await categoryModel.findOne({name})

      if(existingCategory){
        return res.status(200).send({message: 'Category already exists'})
      }
      const newCategory = await Category.create(req.body);
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;