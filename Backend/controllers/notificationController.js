const Order = require('../model/orderModel'); 
const postNotification = async (req, res) => {
    try {
        
        const orders = await Order.find().populate('buyer');
        res.status(200).json(orders);
    } catch (err) {
     
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};