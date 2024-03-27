const Order = require('../model/orderModel'); 
const getAllController = async (req, res) => {
    try {
        
        const orders = await Order.find().populate('buyer');
        res.status(200).json(orders);
    } catch (err) {
     
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getSingleOrderController = async (req, res) => {
    const buyerId = req.params.buyerId;
    try {
        const orders = await Order.find({ 'buyer': buyerId }).populate('buyer');
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {getAllController,getSingleOrderController};