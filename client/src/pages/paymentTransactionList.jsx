import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaFileExport, FaEdit, FaCheck, FaTimes, FaCheckCircle, FaBan } from 'react-icons/fa';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from "../components/AdminSidebar";

const PaymentTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', paymentMethod: '', dateFrom: '', dateTo: '', refundStatus: '' });
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refundAction, setRefundAction] = useState({ paymentId: null, action: null, adminNote: '' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const paymentsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/payments/get');
        const data = await response.json();
        if (data.success) {
          setPayments(data.payments);
          setFilteredPayments(data.payments);
        } else {
          setError('Failed to fetch payments');
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Error fetching payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    let results = payments;
    if (filters.status) results = results.filter(p => p.status === filters.status);
    if (filters.paymentMethod) results = results.filter(p => p.paymentMethod === filters.paymentMethod);
    if (filters.dateFrom) results = results.filter(p => new Date(p.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) results = results.filter(p => new Date(p.createdAt) <= new Date(filters.dateTo));
    if (filters.refundStatus) results = results.filter(p => p.refundRequest?.status === filters.refundStatus);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p => {
        const orderId = typeof p.orderId === 'object' ? p.orderId?._id : p.orderId;
        const userEmail = typeof p.userId === 'object' ? p.userId?.email : p.billingAddress?.email;
        return (
          p.transactionId.toLowerCase().includes(term) ||
          (orderId && orderId.toLowerCase().includes(term)) ||
          (userEmail && userEmail.toLowerCase().includes(term)) ||
          (p.cardDetails?.lastFourDigits?.includes(term))
        );
      });
    }
    setFilteredPayments(results);
    setCurrentPage(1);
  }, [payments, filters, searchTerm]);

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const totalRevenue = filteredPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = filteredPayments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = filteredPayments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0);
  const transactionCounts = {
    completed: filteredPayments.filter(p => p.status === 'completed').length,
    pending: filteredPayments.filter(p => p.status === 'pending').length,
    refunded: filteredPayments.filter(p => p.status === 'refunded').length,
    failed: filteredPayments.filter(p => p.status === 'failed').length,
  };

  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetFilters = () => {
    setFilters({ status: '', paymentMethod: '', dateFrom: '', dateTo: '', refundStatus: '' });
    setSearchTerm('');
  };

  const exportToCSV = () => {
    const headers = [
      'Transaction ID', 'Order ID', 'Amount', 'Currency', 'Payment Method', 'Status', 
      'Card Type', 'Last 4 Digits', 'Date', 'User Email', 'Refund Status', 'Refund Reason', 'Admin Note'
    ];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(p => [
        p.transactionId,
        (typeof p.orderId === 'object' ? p.orderId?._id : p.orderId) || 'N/A',
        p.amount,
        p.currency,
        p.paymentMethod,
        p.status,
        p.cardDetails?.cardType || 'N/A',
        p.cardDetails?.lastFourDigits || 'N/A',
        format(new Date(p.createdAt), 'yyyy-MM-dd HH:mm'),
        (typeof p.userId === 'object' ? p.userId?.email : p.billingAddress?.email || 'N/A'),
        p.refundRequest?.status || 'N/A',
        p.refundRequest?.reason || 'N/A',
        p.refundRequest?.adminNote || 'N/A'
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${new Date().toISOString()}.csv`;
    link.click();
  };

  const handleStatusUpdate = async (paymentId) => {
    setUpdating(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3030/api/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Failed to update payment status');
      const data = await response.json();
      if (data.success) {
        setPayments(payments.map(p => p._id === paymentId ? { ...p, status: newStatus } : p));
        setFilteredPayments(filteredPayments.map(p => p._id === paymentId ? { ...p, status: newStatus } : p));
        setEditingPaymentId(null);
      }
    } catch (error) {
      console.error('Error updating payment status:', error.message);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRefundAction = async (paymentId, action) => {
    setUpdating(true);
    setError(null);
    try {
      const endpoint = action === 'approve' 
        ? `http://localhost:3030/api/payments/${paymentId}/refund/approve`
        : `http://localhost:3030/api/payments/${paymentId}/refund/reject`;
      const body = action === 'reject' && refundAction.adminNote ? { adminNote: refundAction.adminNote } : {};
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || `Failed to ${action} refund request`);
      const data = await response.json();
      if (data.success) {
        const updatedRefundRequest = {
          ...payments.find(p => p._id === paymentId).refundRequest,
          status: action === 'approve' ? 'approved' : 'rejected',
          processedAt: new Date(),
          ...(action === 'reject' && refundAction.adminNote ? { adminNote: refundAction.adminNote } : {})
        };
        const updatedPayment = {
          ...payments.find(p => p._id === paymentId),
          refundRequest: updatedRefundRequest,
          ...(action === 'approve' ? { status: 'refunded' } : {})
        };
        setPayments(payments.map(p => p._id === paymentId ? updatedPayment : p));
        setFilteredPayments(filteredPayments.map(p => p._id === paymentId ? updatedPayment : p));
        setRefundAction({ paymentId: null, action: null, adminNote: '' });
      }
    } catch (error) {
      console.error(`Error ${action}ing refund request:`, error.message);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleTransactionClick = (payment) => setSelectedTransaction(payment);
  const handleOrderClick = async (orderId) => {
    if (!orderId) return;
    setOrderLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3030/orders/${orderId}`);
      const data = await response.json();
      if (data.success) setSelectedOrder(data.order);
      else setError('Failed to fetch order details');
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Error fetching order details');
    } finally {
      setOrderLoading(false);
    }
  };
  const closeModal = () => {
    setSelectedTransaction(null);
    setSelectedOrder(null);
  };

  const renderStatusCell = (payment) => {
    if (editingPaymentId === payment._id) {
      return (
        <div className="flex items-center gap-2">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
            disabled={updating}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button onClick={() => handleStatusUpdate(payment._id)} className="text-green-600 hover:text-green-700 disabled:opacity-50 p-1" disabled={updating}>
            <FaCheck />
          </button>
          <button onClick={() => setEditingPaymentId(null)} className="text-red-600 hover:text-red-700 disabled:opacity-50 p-1" disabled={updating}>
            <FaTimes />
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
          payment.status === 'completed' ? 'bg-green-100 text-green-700' :
          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          payment.status === 'failed' ? 'bg-red-100 text-red-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {payment.status}
        </span>
        <button onClick={() => { setEditingPaymentId(payment._id); setNewStatus(payment.status); }} className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity p-1">
          <FaEdit className="text-sm" />
        </button>
      </div>
    );
  };

  const renderRefundCell = (payment) => {
    if (!payment.refundRequest) return <span className="text-gray-500 text-sm">N/A</span>;
    if (refundAction.paymentId === payment._id && refundAction.action === 'reject') {
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={refundAction.adminNote}
            onChange={(e) => setRefundAction({ ...refundAction, adminNote: e.target.value })}
            placeholder="Reason for rejection (optional)"
            className="text-sm border border-gray-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 resize-none"
            rows="2"
          />
          <div className="flex gap-2">
            <button onClick={() => handleRefundAction(payment._id, 'reject')} className="text-red-600 hover:text-red-700 disabled:opacity-50 p-1" disabled={updating}>
              <FaCheck /> Confirm
            </button>
            <button onClick={() => setRefundAction({ paymentId: null, action: null, adminNote: '' })} className="text-gray-600 hover:text-gray-700 disabled:opacity-50 p-1" disabled={updating}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
          payment.refundRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          payment.refundRequest.status === 'approved' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {payment.refundRequest.status}
        </span>
        {payment.refundRequest.status === 'pending' && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => handleRefundAction(payment._id, 'approve')} className="text-green-600 hover:text-green-700 p-1" title="Approve Refund" disabled={updating}>
              <FaCheckCircle />
            </button>
            <button onClick={() => setRefundAction({ paymentId: payment._id, action: 'reject', adminNote: '' })} className="text-red-600 hover:text-red-700 p-1" title="Reject Refund" disabled={updating}>
              <FaBan />
            </button>
          </div>
        )}
      </div>
    );
  };

  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <AdminSidebar />
        <div className="ml-[16rem] flex items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg"
          >
            <FaFilter className="animate-spin text-blue-600 text-4xl" />
            <p className="text-gray-700 text-lg font-medium">Loading payment transactions...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="ml-[16rem] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md">
                <FaFilter className="text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Payment Transactions</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and review all payment records</p>
              </div>
            </div>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md font-medium"
            >
              <FaFileExport /> Export to CSV
            </button>
          </motion.div>

          {/* Error Notification */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-500 text-white px-5 py-3 rounded-lg shadow-xl mb-8 flex items-center justify-between border border-red-600"
              >
                <p className="text-sm font-medium">{error}</p>
                <button onClick={() => setError(null)} className="text-white hover:text-gray-200 p-1">
                  <FaTimes />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Financial Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { title: 'Total Revenue', value: totalRevenue, color: 'green-600', bg: 'green-50' },
              { title: 'Pending Amount', value: pendingAmount, color: 'yellow-600', bg: 'yellow-50' },
              { title: 'Refunded Amount', value: refundedAmount, color: 'purple-600', bg: 'purple-50' },
              { title: 'Failed Transactions', value: failedAmount, color: 'red-600', bg: 'red-50' },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.03 }} 
                className={`bg-white p-5 rounded-xl shadow-md border border-gray-200 text-center`}
              >
                <h3 className="text-sm text-gray-600 font-medium">{stat.title}</h3>
                <p className={`text-2xl font-bold text-${stat.color} mt-2`}>$ {stat.value.toFixed(2)}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Transaction Counts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {Object.entries(transactionCounts).map(([status, count], index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.03 }} 
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 text-center"
              >
                <h3 className="text-sm text-gray-600 font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50"
                />
              </div>
              {[
                { name: 'status', options: ['', 'pending', 'completed', 'failed', 'refunded'], placeholder: 'All Statuses' },
                { name: 'paymentMethod', options: ['', 'credit_card', 'debit_card', 'bank_transfer'], placeholder: 'All Methods' },
                { name: 'dateFrom', type: 'date', placeholder: 'From Date' },
                { name: 'dateTo', type: 'date', placeholder: 'To Date' },
                { name: 'refundStatus', options: ['', 'pending', 'approved', 'rejected'], placeholder: 'All Refund Statuses' },
              ].map((filter, index) => (
                filter.type === 'date' ? (
                  <input
                    key={index}
                    type="date"
                    name={filter.name}
                    value={filters[filter.name]}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50"
                  />
                ) : (
                  <select
                    key={index}
                    name={filter.name}
                    value={filters[filter.name]}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50"
                  >
                    <option value="">{filter.placeholder}</option>
                    {filter.options.slice(1).map(opt => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}</option>
                    ))}
                  </select>
                )
              ))}
            </div>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 font-medium"
            >
              Reset Filters
            </button>
          </motion.div>

          {/* Transactions Table */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Transaction ID', 'Order ID', 'Amount', 'Method', 'Status', 'Refund Status', 'Card Details', 'Date', 'User'].map((header, index) => (
                      <th key={index} className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPayments.length > 0 ? (
                    currentPayments.map(payment => {
                      const orderId = typeof payment.orderId === 'object' ? payment.orderId?._id : payment.orderId;
                      const userEmail = typeof payment.userId === 'object' ? payment.userId?.email : payment.billingAddress?.email || 'Guest';
                      return (
                        <motion.tr 
                          key={payment._id} 
                          whileHover={{ backgroundColor: '#f9fafb' }} 
                          className="group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleTransactionClick(payment)} className="text-blue-600 hover:underline font-semibold">
                              {payment.transactionId}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {orderId ? (
                              <button onClick={() => handleOrderClick(orderId)} className="text-blue-600 hover:underline font-semibold">
                                {orderId}
                              </button>
                            ) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {payment.currency} {payment.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{renderStatusCell(payment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{renderRefundCell(payment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {payment.cardDetails ? `${payment.cardDetails.cardType || 'Card'} •••• ${payment.cardDetails.lastFourDigits}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{userEmail}</td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-6 text-center text-sm text-gray-500">
                        No payments found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-between items-center mt-6 text-sm text-gray-700 bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <p>Showing {indexOfFirstPayment + 1} to {Math.min(indexOfLastPayment, filteredPayments.length)} of {filteredPayments.length} transactions</p>
              <div className="flex gap-3">
                <button 
                  onClick={handlePrevious} 
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 font-medium" 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={handleNext} 
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 font-medium" 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {/* Transaction Details Modal */}
          <AnimatePresence>
            {selectedTransaction && (
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
                  className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
                        <FaFileExport className="text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
                    </div>
                    <button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-300">
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Transaction ID:</strong> {selectedTransaction.transactionId}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Order ID:</strong> {typeof selectedTransaction.orderId === 'object' ? selectedTransaction.orderId?._id : selectedTransaction.orderId || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Amount:</strong> {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Payment Method:</strong> {selectedTransaction.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Status:</strong> {selectedTransaction.status}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Refund Status:</strong> {selectedTransaction.refundRequest?.status || 'N/A'}</p>
                      {selectedTransaction.refundRequest?.reason && (
                        <p><strong className="text-gray-900">Refund Reason:</strong> {selectedTransaction.refundRequest.reason}</p>
                      )}
                      {selectedTransaction.refundRequest?.adminNote && (
                        <p><strong className="text-gray-900">Admin Note:</strong> {selectedTransaction.refundRequest.adminNote}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Card Details:</strong> {selectedTransaction.cardDetails ? 
                        `${selectedTransaction.cardDetails.cardType || 'Card'} •••• ${selectedTransaction.cardDetails.lastFourDigits}` : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">Date:</strong> {format(new Date(selectedTransaction.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong className="text-gray-900">User Email:</strong> {typeof selectedTransaction.userId === 'object' ? selectedTransaction.userId?.email : selectedTransaction.billingAddress?.email || 'Guest'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 w-full shadow-md font-medium"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order Details Modal */}
          <AnimatePresence>
            {selectedOrder && (
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
                  className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
                        <FaFilter className="text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
                    </div>
                    <button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-300">
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
                  {orderLoading ? (
                    <div className="text-center text-gray-500 py-4">
                      <FaFilter className="animate-spin text-blue-600 text-2xl mx-auto mb-2" />
                      <p>Loading order details...</p>
                    </div>
                  ) : (
                    <div className="space-y-6 text-sm text-gray-700">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><strong className="text-gray-900">Order ID:</strong> {selectedOrder._id}</p>
                        <p><strong className="text-gray-900">Status:</strong> {selectedOrder.status}</p>
                        <p><strong className="text-gray-900">Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                        <p><strong className="text-gray-900">Created At:</strong> {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                        <p><strong className="text-gray-900">Payment ID:</strong> {selectedOrder.paymentId || 'N/A'}</p>
                      </div>
                      {selectedOrder.items && selectedOrder.items.length > 0 && (
                        <div>
                          <h4 className="text-base font-semibold text-gray-800 mb-3">Items</h4>
                          <div className="space-y-4">
                            {selectedOrder.items.map((item, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p><strong className="text-gray-900">Product:</strong> {item.ProductName}</p>
                                <p><strong className="text-gray-900">Price:</strong> ${item.Price.toFixed(2)}</p>
                                <p><strong className="text-gray-900">Quantity:</strong> {item.quantity}</p>
                                <p><strong className="text-gray-900">Size:</strong> {item.selectedSize || 'N/A'}</p>
                                <p><strong className="text-gray-900">Color:</strong> {item.selectedColor || 'N/A'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedOrder.shippingDetails && (
                        <div>
                          <h4 className="text-base font-semibold text-gray-800 mb-3">Shipping Details</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p><strong className="text-gray-900">Full Name:</strong> {selectedOrder.shippingDetails.fullName || 'N/A'}</p>
                            <p><strong className="text-gray-900">Email:</strong> {selectedOrder.shippingDetails.email || 'N/A'}</p>
                            <p><strong className="text-gray-900">Phone:</strong> {selectedOrder.shippingDetails.phone || 'N/A'}</p>
                            <p><strong className="text-gray-900">Address:</strong> {selectedOrder.shippingDetails.address || 'N/A'}</p>
                            <p><strong className="text-gray-900">City:</strong> {selectedOrder.shippingDetails.city || 'N/A'}</p>
                            <p><strong className="text-gray-900">Postal Code:</strong> {selectedOrder.shippingDetails.postalCode || 'N/A'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <button 
                    onClick={closeModal}
                    className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 w-full shadow-md font-medium"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransactions;