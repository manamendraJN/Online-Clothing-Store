import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  FaReceipt, FaSearch, FaFilter, FaPrint, FaTimes, FaBox, 
  FaUndo, FaTrash, FaChevronDown, FaSpinner, FaExclamationTriangle,
  FaCheck, FaUser, FaCreditCard, FaShoppingBag
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

  

  const renderProductNames = (order) => {
    if (!order || !order.items || !Array.isArray(order.items)) return null;
    
    return (
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <FaBox className="mt-1 text-gray-400 flex-shrink-0" />
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <FaBox className="mt-1 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {order.items.slice(0, 3).map((item, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                {item.ProductName || 'Unknown Product'}
                {item.quantity > 1 && ` (×${item.quantity})`}
              </span>
            ))}
            {order.items.length > 3 && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                +{order.items.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleRefundRequest = async () => {
    console.log("Refund request initiated for payment ID:", currentPaymentId);
    try {
      const user = JSON.parse(sessionStorage.getItem('User'));
      if (!user || !user._id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`http://localhost:3030/api/payments/${currentPaymentId}/request-refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reason: refundReason,
          userId: user._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit refund request');
      }

      setPayments(payments.map(payment => 
        payment._id === currentPaymentId ? { 
          ...payment, 
          refundRequest: data.refundRequest || data.payment?.refundRequest 
        } : payment
      ));

      setNotification({
        show: true,
        message: 'Refund request submitted successfully!',
        type: 'success'
      });

      setShowRefundModal(false);
      setRefundReason('');
      setCurrentPaymentId(null);

    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      setDeletingPaymentId(paymentId);
      
      const response = await fetch(`http://localhost:3030/api/payments/delete/${paymentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete payment');
      }

      setPayments(payments.filter(payment => payment._id !== paymentId));

      setNotification({
        show: true,
        message: 'Payment deleted successfully!',
        type: 'success'
      });

    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        type: 'error'
      });
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
        
        if (!user || !user._id) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch(`http://localhost:3030/api/payments/client/${user._id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.payments)) {
          setPayments(data.payments);
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Transactions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg w-full font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Notification Toast */}
          {notification.show && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-sm ${
              notification.type === 'success' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            } animate-fade-in-up`}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <FaCheck className="h-5 w-5" />
                  ) : (
                    <FaExclamationTriangle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
                <button 
                  onClick={() => setNotification({ ...notification, show: false })}
                  className="ml-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md">
                <FaReceipt className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Payment History</h2>
                <p className="text-gray-500 text-sm mt-1">
                  View and manage your transaction records
                </p>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-700 font-medium">
                <span className="text-blue-600">{filteredPayments.length}</span> transaction{filteredPayments.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
            
{/* Filters Section */}
<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
  <div className="flex flex-col md:flex-row gap-4">
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search transactions..."
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    
    <div className="relative w-full md:w-48">
      <select
        className="appearance-none w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
        <option value="refunded">Refunded</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <FaChevronDown className="text-gray-400 text-sm" />
      </div>
    </div>
  </div>
</div>
          </div>
          
{/* Empty State */}
{filteredPayments.length === 0 ? (
  <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 text-center">
    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
      <FaReceipt className="text-gray-400 text-3xl" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {payments.length === 0 ? 'No transactions yet' : 'No matching transactions found'}
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      {payments.length === 0 
        ? 'Your payment history will appear here once you make a transaction.' 
        : 'Try adjusting your search or filter criteria.'}
    </p>
    {payments.length > 0 && (
      <button
        onClick={() => {
          setSearchTerm('');
          setFilterStatus('all');
        }}
        className="mt-6 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
      >
        Clear all filters
      </button>
    )}
  </div>
) : (
  <div className="space-y-3">
    {filteredPayments.map(payment => (
      <div 
        key={payment._id} 
        className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all ${
          selectedPayment?._id === payment._id ? 'ring-2 ring-blue-500 border-blue-300' : ''
        }`}
      >
<div 
  className="cursor-pointer"
  onClick={() => setSelectedPayment(payment)}
>
  <div className="flex flex-col md:flex-row justify-between gap-4">
    <div className="flex-1 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${
        payment.status === 'completed' ? 'bg-green-100 text-green-600' :
        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
        payment.status === 'failed' ? 'bg-red-100 text-red-600' :
        'bg-purple-100 text-purple-600'
      }`}>
        <FaReceipt className="text-lg" />
      </div>
      <div>
        <p className="font-semibold text-gray-800">
          Order #{formatOrderId(payment.orderId)}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          {payment.createdAt ? format(new Date(payment.createdAt), 'MMM dd, yyyy - h:mm a') : 'Date not available'}
        </p>
        {payment.orderId && renderProductNames(payment.orderId)}
      </div>
    </div>
    
    <div className="flex flex-col items-end gap-2">
      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
        'bg-purple-100 text-purple-800'
      }`}>
        {payment.status || 'unknown'}
      </span>
      <span className="font-bold text-lg text-gray-900">
        {payment.currency || 'USD'} {payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
      </span>
    </div>
  </div>
</div>

<div className="mt-4 border-t pt-4" onClick={e => e.stopPropagation()}>
  {(payment.status === 'failed' || payment.status === 'success') && (
    <div className="flex flex-col sm:flex-row gap-2">
      {payment.status === 'failed' && (
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this payment record?')) {
              handleDeletePayment(payment._id);
            }
          }}
          disabled={deletingPaymentId === payment._id}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-800 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
        >
          {deletingPaymentId === payment._id ? (
            <>
              <FaSpinner className="animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <FaTrash />
              Delete Payment
            </>
          )}
        </button>
      )}

      {!payment.refundRequest && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setCurrentPaymentId(payment._id);
            setShowRefundModal(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100"
        >
          <FaUndo />
          Request Refund
        </button>
      )}
    </div>
  )}

  {payment.refundRequest && (
    <div className="text-sm">
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${
        payment.refundRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        payment.refundRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        <span className="font-medium">Request Refund {payment.refundRequest.status}</span>
        {payment.refundRequest.status === 'pending' && (
          <FaSpinner className="ml-2 text-xs animate-spin" />
        )}
      </div>
      {payment.refundRequest.reason && (
        <p className="mt-2 text-gray-600 text-sm">Reason: {payment.refundRequest.reason}</p>
      )}
    </div>
  )}
</div></div>
              ))}
            </div>
          )}

{selectedPayment && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <FaReceipt className="text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Payment Receipt</h3>
        </div>
        <button 
          onClick={() => setSelectedPayment(null)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Transaction ID</h4>
                      <p className="font-mono font-medium">{selectedPayment.transactionId || 'N/A'}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Order ID</h4>
                      <p className="font-mono font-medium">
                        {typeof selectedPayment.orderId === 'string' 
                          ? selectedPayment.orderId 
                          : selectedPayment.orderId?._id || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                      <p className="font-medium">
                        {selectedPayment.createdAt ? format(new Date(selectedPayment.createdAt), 'PPPpp') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
                      <p className="font-medium capitalize">
                        {selectedPayment.paymentMethod ? 
                          selectedPayment.paymentMethod.replace('_', ' ') : 'N/A'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        selectedPayment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedPayment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedPayment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedPayment.status || 'unknown'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
                      <p className="text-2xl font-bold">
                        {selectedPayment.currency || 'USD'} {selectedPayment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPayment?.orderId?.items && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-semibold mb-4">Ordered Items</h4>
                    <div className="space-y-4">
                      {selectedPayment.orderId.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.ProductName || 'Unknown Product'}</p>
                            <p className="text-sm text-gray-500">
                              Size: {item.selectedSize || 'N/A'}, Color: {item.selectedColor || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {item.quantity} × {item.Price?.toFixed(2) || '0.00'} {selectedPayment.currency || 'USD'}
                            </p>
                            <p className="font-bold">
                              {(item.quantity * (item.Price || 0)).toFixed(2)} {selectedPayment.currency || 'USD'}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between border-t pt-3 mt-3">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">
                          {selectedPayment.orderId.totalAmount?.toFixed(2) || selectedPayment.amount?.toFixed(2) || '0.00'} 
                          {selectedPayment.currency || 'USD'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayment.refundRequest && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-semibold mb-2">Refund Request</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Status</h5>
                        <span className={`px-2 py-1 text-sm rounded font-medium ${
                          selectedPayment.refundRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedPayment.refundRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedPayment.refundRequest.status}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Requested On</h5>
                        <p className="font-medium">
                          {selectedPayment.refundRequest.requestedAt ? 
                            format(new Date(selectedPayment.refundRequest.requestedAt), 'PPPpp') : 'N/A'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Reason</h5>
                        <p className="font-medium">{selectedPayment.refundRequest.reason || 'No reason provided'}</p>
                      </div>
                      {selectedPayment.refundRequest.adminNote && (
                        <div className="md:col-span-2">
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Admin Note</h5>
                          <p className="font-medium">{selectedPayment.refundRequest.adminNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedPayment.cardDetails && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-semibold mb-4">Payment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Card Type</h5>
                        <p className="font-medium capitalize">
                          {selectedPayment.cardDetails.cardType || 'Unknown'}
                        </p>
                      </div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Card Number</h5>
                        <p className="font-medium">
                          •••• {selectedPayment.cardDetails.lastFourDigits || '••••'}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Expiry Date</h5>
                        <p className="font-medium">
                          {selectedPayment.cardDetails.expiryDate || '••/••'}
                        </p>
                      </div>
                    </div>
                  
                )}

                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-lg font-semibold mb-4">Billing Information</h4>
                  {selectedPayment.billingAddress ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Name</h5>
                        <p className="font-medium">{selectedPayment.billingAddress.name || ''}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Email</h5>
                        <p className="font-medium">{selectedPayment.billingAddress.email || ''}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Address</h5>
                        <p className="font-medium">{selectedPayment.billingAddress.address || ''}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">City</h5>
                        <p className="font-medium">{selectedPayment.billingAddress.city || ''}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Postal Code</h5>
                        <p className="font-medium">{selectedPayment.billingAddress.postalCode || ''}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No billing information available</p>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPrint /> Print Receipt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Added refund request modal */}
          {showRefundModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <FaUndo className="text-lg" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Request Refund</h3>
        </div>
        <button 
          onClick={() => setShowRefundModal(false)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">Reason for refund</label>
        <textarea
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
          rows="4"
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          placeholder="Please explain why you're requesting a refund"
          required
        />
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button
          onClick={() => setShowRefundModal(false)}
          className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleRefundRequest}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-70"
          disabled={!refundReason.trim()}
        >
          Submit Request
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
  );
};

export default ClientTransactions;