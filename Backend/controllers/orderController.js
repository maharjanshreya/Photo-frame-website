const Order = require('../model/orderModel'); 
const getAllOrderController = async (req, res) => {
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
        const orders = await Order.find({ 'buyer': buyerId });
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const updateOrderController =  async (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;

    try {
        // Find the order by ID and update its status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Return the updated order
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = {getAllOrderController,getSingleOrderController,updateOrderController};