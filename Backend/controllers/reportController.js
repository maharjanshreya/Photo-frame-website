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
    const reports = await Report.find();
    res.json(reports);

  } catch (error) {

    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getReplyController = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('User ID:', userId);
    const reports = await Report.find({ user: userId });
    res.json({
       reports: reports
    });
    console.log('Admin Replies:', reports);
    console.log('Before save:', JSON.stringify(this.adminReply, null, 2));
  } catch (error) {
    // Handle errors
    console.error('Error fetching admin replies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// reply back by admin 
// const replyToReportController = async (req, res) => {
//   const { reportId, adminReply } = req.body;
//   console.log('Report repl,y:', adminReply);
//   try {
//     const reportReply = await Report.findOne({_id: reportId});
//     const reply = await reportReply.addMessage(adminReply);
//     await reportReply.save();
//     console.log('Updated Report:', reportReply);
//     res.status(201).json({ message: 'User contact successful', reply: reply });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
const replyToReportController = async (req, res) => {
  const { reportId, replyText,createdAt } = req.body;
  console.log('Report repl,y:', replyText);
  console.log('Report repl,y:', createdAt);
  try {
    const reportReply = await Report.findOne({_id: reportId});
    if(reportReply){
      const reply = await reportReply.addMessage(replyText,createdAt);
      await reportReply.save();
      console.log('Updated Report:', reportReply);
      res.status(201).json({ message: 'User contact successful', reply: reply });
  }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



module.exports = {reportController,getReportController,replyToReportController,getReplyController};
