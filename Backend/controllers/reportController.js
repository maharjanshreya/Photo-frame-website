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
//get reports
const getReportController = async (req, res) => {    
    try {
        // Fetch all reports from the database
        const reports = await Report.find();
        // Send the reports as a JSON response
        res.json(reports);
      } catch (error) {
        // Handle errors
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};
module.exports = {reportController,getReportController};
