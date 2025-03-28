const Order = require('../models/Order.Model');
const Payment = require('../models/Payment.Model');
const { v4: uuidv4 } = require('uuid');

exports.createPayment = async (req, res) => {
  try {
    const { orderId, userId, paymentMethod, cardDetails, billingAddress } = req.body;

    // Validate the order exists and belongs to the user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found or does not belong to user' 
      });
    }

    // Check if order is already paid
    if (order.status === 'paid') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is already paid' 
      });
    }

    // Create payment record
    const payment = new Payment({
      orderId,
      userId,
      amount: order.totalAmount,
      currency: 'USD',
      paymentMethod,
      transactionId: `txn_${uuidv4()}`,
      status: 'completed',
      cardDetails: {
        lastFourDigits: cardDetails.number.slice(-4),
        cardType: cardDetails.type,
        expiryDate: cardDetails.expiry
      },
      billingAddress
    });

    await payment.save();

    // Update order status and link payment
    order.status = 'pending';
    order.paymentId = payment._id;
    await order.save();

    res.status(201).json({ 
      success: true, 
      message: 'Payment processed successfully',
      payment,
      order
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'orderId',
        select: '_id totalAmount' // Only include these fields from Order
      })
      .populate({
        path: 'userId',
        select: 'email' // Only include email from User
      });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments',
      details: error.message
    });
  }
};


// In your payment controller
exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'orderId',
        select: 'items totalAmount status',
        populate: {
          path: 'items.productId',
          model: 'Product',
          select: 'name price description' // Make sure these fields match your Product model
        }
      });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user payments',
      details: error.message
    });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId')
      .populate('userId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment',
      details: error.message
    });
  }
};

// Request refund (user)
exports.requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { transactionId: id },
      {
        'refundRequest.status': 'pending',
        'refundRequest.requestedAt': new Date(),
        'refundRequest.reason': reason
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to request refund',
      details: error.message 
    });
  }
};

// Process refund (admin)
exports.processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNote } = req.body; // action: 'approve' or 'reject'

    const update = {
      'refundRequest.processedAt': new Date(),
      'refundRequest.adminNote': adminNote
    };

    if (action === 'approve') {
      update['refundRequest.status'] = 'approved';
      update.status = 'refunded';
    } else {
      update['refundRequest.status'] = 'rejected';
    }

    const payment = await Payment.findByIdAndUpdate(id, update, { new: true });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process refund',
      details: error.message 
    });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { refundStatus } = req.query;
    let query = {};

    if (refundStatus) {
      query['refundRequest.status'] = refundStatus;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .populate('orderId');

    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch payments',
      details: error.message 
    });
  }
};

// Delete payment (user can only delete their own)
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    // Direct deletion without user verification
    const result = await Payment.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Payment not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Payment deleted successfully' 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete payment',
      details: error.message 
    });
  }
};

// Update payment status (admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('orderId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // If updating to 'completed' and there's an associated order, mark it as paid
    if (status === 'completed' && payment.orderId) {
      await Order.findByIdAndUpdate(
        payment.orderId._id,
        { status: 'paid' }
      );
    }

    res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment status',
      details: error.message
    });
  }
};



//getPaymentsByUser

// exports.getPaymentsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     const payments = await Payment.find({ userId })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: 'orderId',
//         select: 'items totalAmount status',
//         populate: {
//           path: 'items.productId',
//           model: 'Product',
//           select: 'name price image' // Include whatever product fields you need
//         }
//       });

//     res.status(200).json({
//       success: true,
//       count: payments.length,
//       payments
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch user payments',
//       details: error.message
//     });
//   }
// };