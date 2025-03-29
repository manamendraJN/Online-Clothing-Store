const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/', paymentController.createPayment);
router.get('/get', paymentController.getAllPayments);
router.get('/client/:userId', paymentController.getPaymentsByUser);
router.get('/:id', paymentController.getPaymentById);
router.post('/:id/request-refund', paymentController.requestRefund);
router.patch('/:id/process-refund', paymentController.processRefund);
router.delete('/delete/:id', paymentController.deletePayment);
router.put('/:id/status', paymentController.updatePaymentStatus);
router.put('/:paymentId/refund/reject', paymentController.processRefundStatus);
router.put('/:paymentId/refund/approve', paymentController.updateRefundStatus);

module.exports = router;