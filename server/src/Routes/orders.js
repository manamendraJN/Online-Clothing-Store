const router = require('express').Router();
const Order = require('../models/Order.Model');
const mongoose = require('mongoose');

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Orders router is working!' });
});

// Create order route - simplified for troubleshooting
router.post('/create', async (req, res) => {
  console.log('Received order request at /orders/create');
  try {
    // Basic validation
    const { userId, items, shippingDetails, totalAmount } = req.body;
    
    if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid order data' 
      });
    }

    // Create a new order
    const order = new Order({
      userId,
      items,
      shippingDetails,
      totalAmount,
      status: 'pending'
    });

    // Save to database
    const savedOrder = await order.save();
    console.log('Order saved successfully', savedOrder._id);
    
    return res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      order: savedOrder 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create order'
    });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }); // Most recent first
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete an order
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.headers.userid;
    
    console.log('Delete request received:', { orderId, userId });

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const order = await Order.findOne({ _id: orderId, userId: userId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or unauthorized'
      });
    }
    
    await Order.findByIdAndDelete(orderId);
    console.log('Order deleted successfully:', orderId);
    
    return res.json({
      success: true,
      message: 'Order deleted successfully'
    });
    
  } catch (error) {
    console.error('Server error deleting order:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while deleting order'
    });
  }
});

module.exports = router;
