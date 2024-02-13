const Report = require('../model/reportModel');
const User = require('../model/userModel');

// Controller function for creating a report
const reportController = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const report = new Report({
      title,
      description,
      user: userId, // Assign the user ObjectId
    });

    await report.save();

    res.status(201).json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
//get products
const getReportController = async (req, res) => {
    
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
module.exports = {reportController,getReportController};
