
const Category = require("../model/categoryModel");
const createCategoryController = async (req, res) => {
    
    const { name } = req.body;
    if (!name) {
        return res.status(401).json({ message: 'Name is required' });
    }
    try {
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            console.log("Category already exits");
            return res.status(200).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();

        if (savedCategory) {
            return res.status(201).json({ message: 'Category added', category: savedCategory });
        } else {
            return res.status(500).json({ error: 'Failed to save category' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const getCategoryController = async (req, res) => {
    
    try {
        const categories = await Category.find({}, 'name');

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        const categoryData = categories.map(category => ({
            id: category._id,
            name: category.name
        }));
        res.json({ categories: categoryData });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};
const deleteCategoryController = async (req, res) => {
    
    try {
        const categoryId = req.params.id;

        console.log('Received DELETE request for category ID:', categoryId);
        // Perform the delete operation
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (deletedCategory) {
            return res.json({ message: 'Category deleted successfully', deletedCategory });
        } else {
            console.log('Category not found:', categoryId);
            return res.status(404).json({ error: 'Failed to delete category' });
        }
    } catch (error) {
        console.error("error : ", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const updateCategoryController = async (req, res) => {
    
    if (!req.body) {
        return res.status(422).json({ message: 'req.body is null' });
    }

    try {
        const categoryId = req.params.id;
        const updates = req.body; // Updates should be sent as JSON in the request body

        const updatedCategory = await Category.findByIdAndUpdate(
            { _id: categoryId },
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not updated' });
        }
        console.log('Updated Category:', updatedCategory);
        res.json(updatedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
module.exports = {createCategoryController,getCategoryController,deleteCategoryController,updateCategoryController};
