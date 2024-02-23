const Report = require('../model/reportModel');
const User = require('../model/userModel');

// post report
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

const getReplyController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch reports for the specified user ID
    const reports = await Report.find({ user: userId });

    // Extract admin replies from the reports
    const adminReplies = reports.length > 0 ? reports[0].adminReply : [];

    res.json(adminReplies);
    console.log('Admin Replies:', adminReplies);
  } catch (error) {
    // Handle errors
    console.error('Error fetching admin replies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// reply back by admin 
const replyToReportController = async (req, res) => {
  const { reportId, adminReply } = req.body;
  console.log('report Replt:', adminReply);
  try {
    
    const reportReply = await Report.findOne({_id: reportId});
    console.log('Updated Report:', reportReply);
    console.log('Original Report:', reportReply);

    const reply = await reportReply.addMessage(adminReply);
    await reportReply.save();

    console.log('Updated Report:', reportReply);

    res.status(201).json({ message: 'User contact successful', reply: reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports = {reportController,getReportController,replyToReportController,getReplyController};
