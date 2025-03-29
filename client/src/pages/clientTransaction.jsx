import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaReceipt, FaSearch, FaFilter, FaPrint, FaTimes, FaBox, 
  FaUndo, FaTrash, FaChevronDown, FaSpinner, FaExclamationTriangle,
  FaCheck
} from 'react-icons/fa';

const ClientTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [deletingPaymentId, setDeletingPaymentId] = useState(null);

  const formatOrderId = (orderId) => {
    if (!orderId) return 'N/A';
    const idString = typeof orderId === 'string' ? orderId : orderId._id?.toString() || '';
    return idString.slice(-6).toUpperCase();
  };

  const renderItemDetails = (order) => {
    if (!order || !order.items || !Array.isArray(order.items)) {
      return <p className="text-sm text-gray-500">No items available</p>;
    }

    return (
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="mt-4 overflow-hidden"
      >
        <h4 className="font-medium text-gray-700 mb-3 text-sm">Order Items</h4>
        <div className="grid grid-cols-1 gap-3">
          {order.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaBox className="text-blue-500 text-sm" />
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {item.ProductName || 'Unknown Product'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium text-gray-700">Size:</span>{' '}
                      {item.selectedSize || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Color:</span>{' '}
                      {item.selectedColor || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Quantity:</span>{' '}
                      {item.quantity}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Price:</span>{' '}
                      ${(item.Price || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${(item.quantity * (item.Price || 0)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.quantity} × ${(item.Price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3030/orders/${orderId}`);
      const data = await response.json();
      if (data.success) return data.order;
      console.error('Failed to fetch order:', data.error);
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  const handleRefundRequest = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('User'));
      if (!user || !user._id) throw new Error('User not authenticated');

      const response = await fetch(`http://localhost:3030/api/payments/${currentPaymentId}/request-refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: refundReason, userId: user._id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit refund request');

      setPayments(payments.map(payment => 
        payment._id === currentPaymentId ? { 
          ...payment, 
          refundRequest: { status: 'pending', requestedAt: new Date(), reason: refundReason, processedAt: null, adminNote: null }
        } : payment
      ));

      setNotification({ show: true, message: 'Refund request submitted successfully! Awaiting admin approval.', type: 'success' });
      setShowRefundModal(false);
      setRefundReason('');
      setCurrentPaymentId(null);
    } catch (error) {
      console.error('Refund request error:', error);
      setNotification({ show: true, message: error.message, type: 'error' });
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      setDeletingPaymentId(paymentId);
      const response = await fetch(`http://localhost:3030/api/payments/delete/${paymentId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete payment');
      }

      setPayments(payments.filter(payment => payment._id !== paymentId));
      setNotification({ show: true, message: 'Payment deleted successfully!', type: 'success' });
    } catch (error) {
      setNotification({ show: true, message: error.message, type: 'error' });
    } finally {
      setDeletingPaymentId(null);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatOrderId(payment.orderId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = JSON.parse(sessionStorage.getItem('User'));
        if (!user || !user._id) throw new Error('User not authenticated');

        const response = await fetch(`http://localhost:3030/api/payments/client/${user._id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('Fetched payments:', data.payments);

        if (data.success && Array.isArray(data.payments)) {
          const enrichedPayments = await Promise.all(
            data.payments.map(async (payment) => {
              if (payment.orderId && typeof payment.orderId === 'string') {
                const order = await fetchOrderDetails(payment.orderId);
                return { ...payment, orderId: order };
              }
              return payment;
            })
          );
          console.log('Enriched payments with order details:', enrichedPayments);
          setPayments(enrichedPayments);
        } else {
          throw new Error(data.message || 'Invalid payments data');
        }
      } catch (error) {
        console.error('Error in fetchPayments:', error);
        setError(error.message);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg"
        >
          <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          <p className="text-gray-700 text-lg font-medium">Loading transactions...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-200"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mx-auto mb-4">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something Went Wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification Toast */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl border ${
                notification.type === 'success' 
                  ? 'bg-green-500 text-white border-green-600' 
                  : 'bg-red-500 text-white border-red-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? (
                  <FaCheck className="text-lg" />
                ) : (
                  <FaExclamationTriangle className="text-lg" />
                )}
                <p className="text-sm font-medium">{notification.message}</p>
                <button 
                  onClick={() => setNotification({ ...notification, show: false })}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md">
              <FaReceipt className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage your past purchases</p>
            </div>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg shadow-sm border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              {filteredPayments.length} Transaction{filteredPayments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-5 rounded-xl shadow-md mb-8 border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID or order #"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <select
                className="appearance-none w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        {filteredPayments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center"
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mx-auto mb-4">
              <FaReceipt className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {payments.length === 0 ? 'No Transactions Yet' : 'No Matching Transactions'}
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              {payments.length === 0 
                ? 'Your transaction history will appear here once you make a purchase.'
                : 'Try adjusting your search or filters to find what you’re looking for.'
              }
            </p>
            {payments.length > 0 && (
              <button
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                className="mt-6 px-5 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 font-medium"
              >
                Reset Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
          >
            {filteredPayments.map(payment => (
              <motion.div
                key={payment._id}
                whileHover={{ scale: 1.01 }}
                className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 ${
                  selectedPayment?._id === payment._id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg shadow-sm ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-600' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <FaReceipt className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">Order #{formatOrderId(payment.orderId)}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {payment.createdAt ? format(new Date(payment.createdAt), 'MMM dd, yyyy - h:mm a') : 'N/A'}
                        </p>
                        {payment.orderId && renderItemDetails(payment.orderId)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {payment.status || 'unknown'}
                      </span>
                      <span className="font-bold text-xl text-gray-900">
                        {payment.currency || 'USD'} {payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-200">
                  {(payment.status === 'failed' || payment.status === 'completed') && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      {payment.status === 'failed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this payment record?')) {
                              handleDeletePayment(payment._id);
                            }
                          }}
                          disabled={deletingPaymentId === payment._id}
                          className="flex items-center justify-center gap-2 px-5 py-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-300 disabled:opacity-50 font-medium"
                        >
                          {deletingPaymentId === payment._id ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Deleting
                            </>
                          ) : (
                            <>
                              <FaTrash />
                              Delete
                            </>
                          )}
                        </button>
                      )}
                      {payment.status === 'completed' && (!payment.refundRequest || payment.refundRequest.status === null) && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPaymentId(payment._id);
                            setShowRefundModal(true);
                          }}
                          className="flex items-center justify-center gap-2 px-5 py-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 font-medium"
                        >
                          <FaUndo />
                          Request Refund
                        </button>
                      )}
                    </div>
                  )}
                  {payment.refundRequest && payment.refundRequest.status !== null && (
                    <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                        payment.refundRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        payment.refundRequest.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        Refund {payment.refundRequest.status}
                        {payment.refundRequest.status === 'pending' && <FaSpinner className="ml-2 animate-spin text-sm" />}
                      </span>
                      {payment.refundRequest.reason && (
                        <p className="mt-2 text-sm">Reason: {payment.refundRequest.reason}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Payment Details Modal */}
        <AnimatePresence>
          {selectedPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200"
              >
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
                      <FaReceipt className="text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Transaction Details</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedPayment(null)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-300"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div className="space-y-5">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Transaction ID</h4>
                      <p className="font-mono text-sm mt-1">{selectedPayment.transactionId || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
                      <p className="font-mono text-sm mt-1">
                        {typeof selectedPayment.orderId === 'string' ? selectedPayment.orderId : selectedPayment.orderId?._id || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                      <p className="text-sm mt-1">
                        {selectedPayment.createdAt ? format(new Date(selectedPayment.createdAt), 'PPPpp') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                      <p className="text-sm mt-1 capitalize">{selectedPayment.paymentMethod?.replace('_', ' ') || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full mt-1 inline-block ${
                        selectedPayment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        selectedPayment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        selectedPayment.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {selectedPayment.status || 'unknown'}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {selectedPayment.currency || 'USD'} {selectedPayment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPayment.orderId?.items && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Items Purchased</h4>
                    <div className="space-y-4">
                      {selectedPayment.orderId.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
                          <div>
                            <p className="font-medium text-gray-800">{item.ProductName || 'Unknown Product'}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Size: {item.selectedSize || 'N/A'} | Color: {item.selectedColor || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">
                              {item.quantity} × ${(item.Price || 0).toFixed(2)}
                            </p>
                            <p className="font-semibold text-gray-900 mt-1">
                              ${(item.quantity * (item.Price || 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-gray-200 pt-4 text-sm bg-gray-50 p-4 rounded-lg">
                        <span className="font-medium text-gray-700">Total Amount</span>
                        <span className="font-bold text-gray-900 text-lg">
                          {selectedPayment.orderId.totalAmount?.toFixed(2) || selectedPayment.amount?.toFixed(2) || '0.00'} {selectedPayment.currency || 'USD'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayment.refundRequest && selectedPayment.refundRequest.status !== null && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Refund Request Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Status</h5>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full mt-1 inline-block ${
                          selectedPayment.refundRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          selectedPayment.refundRequest.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedPayment.refundRequest.status}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Requested On</h5>
                        <p className="text-sm mt-1">
                          {selectedPayment.refundRequest.requestedAt ? format(new Date(selectedPayment.refundRequest.requestedAt), 'PPPpp') : 'N/A'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <h5 className="text-xs font-medium text-gray-500">Reason</h5>
                        <p className="text-sm mt-1">{selectedPayment.refundRequest.reason || 'No reason provided'}</p>
                      </div>
                      {selectedPayment.refundRequest.adminNote && (
                        <div className="md:col-span-2">
                          <h5 className="text-xs font-medium text-gray-500">Admin Note</h5>
                          <p className="text-sm mt-1">{selectedPayment.refundRequest.adminNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedPayment.cardDetails && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Card Type</h5>
                        <p className="capitalize mt-1">{selectedPayment.cardDetails.cardType || 'Unknown'}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Card Number</h5>
                        <p className="mt-1">•••• {selectedPayment.cardDetails.lastFourDigits || '••••'}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Expiry Date</h5>
                        <p className="mt-1">{selectedPayment.cardDetails.expiryDate || '••/••'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Billing Information</h4>
                  {selectedPayment.billingAddress ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Name</h5>
                        <p className="mt-1">{selectedPayment.billingAddress.name || ''}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Email</h5>
                        <p className="mt-1">{selectedPayment.billingAddress.email || ''}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h5 className="text-xs font-medium text-gray-500">Address</h5>
                        <p className="mt-1">{selectedPayment.billingAddress.address || ''}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">City</h5>
                        <p className="mt-1">{selectedPayment.billingAddress.city || ''}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-500">Postal Code</h5>
                        <p className="mt-1">{selectedPayment.billingAddress.postalCode || ''}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">No billing information available</p>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md font-medium"
                  >
                    <FaPrint /> Print Receipt
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refund Request Modal */}
        <AnimatePresence>
          {showRefundModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
              >
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
                      <FaUndo className="text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Request Refund</h3>
                  </div>
                  <button 
                    onClick={() => setShowRefundModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-300"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
                <div className="relative mb-6">
                  <textarea
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50 peer resize-none"
                    rows="4"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label className="absolute left-4 top-4 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-medium">
                    Reason for refund
                  </label>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="px-5 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefundRequest}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 shadow-md font-medium"
                    disabled={!refundReason.trim()}
                  >
                    Submit Request
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientTransactions;