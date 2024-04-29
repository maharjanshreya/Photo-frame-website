const Order = require('../model/orderModel'); 
const Notification = require('../model/notificationModel');
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
    console.log(buyerId);
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
        let message;
        if (status === 'Delivered') {
            message = 'Your parcel has been delivered.';
        } else if (status === 'Shipped') {
            message = 'Your parcel has been shipped.';
        }
        else if (status === 'Cancelled') {
            message = 'Your parcel is cancelled.';
        }
        else{
            message = 'Your parcel is in process.';
        }
        const notification = new Notification({
            userId: updatedOrder.buyer,
            message: message
        });
        await notification.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const deleteOrderController = async (req, res) => {
    try {
        const orderId = req.params.oid;
        const deletedProduct = await Order.findByIdAndDelete(orderId);
  
        if (deletedProduct) {
            return res.json({ message: 'Order deleted successfully', deletedProduct  });
        } else {
          console.log('Order not found:', deletedProduct);
            return res.status(404).json({ error: 'Failed to delete order' });
        }
    } catch (error) {
        console.error("error : ",error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {getAllOrderController,getSingleOrderController,updateOrderController,deleteOrderController};