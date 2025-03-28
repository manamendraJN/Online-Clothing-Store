const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'cash_on_delivery', 'bank_transfer'],
    required: true
  },
  transactionId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  cardDetails: {
    lastFourDigits: String,
    cardType: String,
    expiryDate: String
  },
  billingAddress: {
    name: String,
    email: String,
    address: String,
    city: String,
    postalCode: String
  },
  refundRequest: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: null
    },
    requestedAt: Date,
    processedAt: Date,
    reason: String,
    adminNote: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);