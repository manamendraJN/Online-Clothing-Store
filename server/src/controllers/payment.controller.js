const Order = require('../models/Order.Model');
const Payment = require('../models/Payment.Model');
const { v4: uuidv4 } = require('uuid');

exports.createPayment = async (req, res) => {
  try {
    const { orderId, userId, paymentMethod, cardDetails, billingAddress } = req.body;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found or does not belong to user' 
      });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is already paid' 
      });
    }

    const payment = new Payment({
      orderId,
      userId,
      amount: order.totalAmount,
      currency: 'USD',
      paymentMethod,
      transactionId: `txn_${uuidv4()}`,
      status: 'pending',
      cardDetails: {
        lastFourDigits: cardDetails.number.slice(-4),
        cardType: cardDetails.type,
        expiryDate: cardDetails.expiry
      },
      billingAddress
    });

    await payment.save();

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
        select: '_id totalAmount'
      })
      .populate({
        path: 'userId',
        select: 'email'
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

exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'orderId',
        select: 'items totalAmount status',
        populate: {
          path: 'items.productId', // Remove this if items don’t reference Product
          model: 'Product',
          select: 'name price description'
        }
      });
    console.log('Payments with populated orderId:', payments); // Debug
    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
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

exports.requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, userId } = req.body;

    const payment = await Payment.findOne({ _id: id, userId });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found or does not belong to user' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ success: false, error: 'Refund can only be requested for completed payments' });
    }

    if (payment.refundRequest && payment.refundRequest.status) {
      return res.status(400).json({ success: false, error: 'Refund request already exists' });
    }

    payment.refundRequest = {
      status: 'pending',
      requestedAt: new Date(),
      reason,
      processedAt: null,
      adminNote: null
    };

    await payment.save();

    res.status(200).json({ 
      success: true, 
      payment,
      message: 'Refund request submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to request refund',
      details: error.message 
    });
  }
};

exports.processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNote } = req.body; // action: 'approve' or 'reject'

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    if (!payment.refundRequest || payment.refundRequest.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'No pending refund request to process' });
    }

    const update = {
      'refundRequest.processedAt': new Date(),
      'refundRequest.adminNote': adminNote
    };

    if (action === 'approve') {
      update['refundRequest.status'] = 'approved';
      update.status = 'refunded';
    } else if (action === 'reject') {
      update['refundRequest.status'] = 'rejected';
    } else {
      return res.status(400).json({ success: false, error: 'Invalid action. Use "approve" or "reject"' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, update, { new: true });

    res.status(200).json({ success: true, payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process refund',
      details: error.message 
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

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

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

// router.put('/:paymentId/refund/approve', async (req, res) 
  exports.updateRefundStatus = async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.paymentId);
      if (!payment) {
        return res.status(404).json({ success: false, error: 'Payment not found' });
      }
      if (!payment.refundRequest || payment.refundRequest.status !== 'pending') {
        return res.status(400).json({ success: false, error: 'No pending refund request' });
      }
  
      payment.refundRequest.status = 'approved';
      payment.refundRequest.processedAt = new Date();
      payment.status = 'refunded'; // Set payment status to "refunded"
      await payment.save();
  
      res.json({ success: true, payment });
    } catch (error) {
      console.error('Error approving refund:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
// router.put('/:paymentId/refund/reject', async (req, res)

exports.processRefundStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    if (!payment.refundRequest || payment.refundRequest.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'No pending refund request' });
    }

    payment.refundRequest.status = 'rejected';
    payment.refundRequest.processedAt = new Date();
    if (req.body.adminNote) {
      payment.refundRequest.adminNote = req.body.adminNote;
    }
    await payment.save();

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error rejecting refund:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};