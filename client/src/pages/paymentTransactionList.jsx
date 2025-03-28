import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaFileExport, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import AdminSidebar from "../components/AdminSidebar";

const PaymentTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: ''
  });
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Fetch all payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/payments/get');
        const data = await response.json();
        
        if (data.success) {
          setPayments(data.payments);
          setFilteredPayments(data.payments);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = payments;

    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }

    if (filters.paymentMethod) {
      results = results.filter(p => p.paymentMethod === filters.paymentMethod);
    }

    if (filters.dateFrom) {
      results = results.filter(p => new Date(p.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      results = results.filter(p => new Date(p.createdAt) <= new Date(filters.dateTo));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p => {
        const orderId = typeof p.orderId === 'object' ? p.orderId?._id : p.orderId;
        const userEmail = typeof p.userId === 'object' 
          ? p.userId?.email 
          : p.billingAddress?.email;
    
        return (
          p.transactionId.toLowerCase().includes(term) ||
          orderId.toLowerCase().includes(term) ||
          (userEmail && userEmail.toLowerCase().includes(term)) ||
          (p.cardDetails?.lastFourDigits?.includes(term))
        );
      });
    }

    setFilteredPayments(results);
  }, [payments, filters, searchTerm]);

  // Financial Calculations
  const totalRevenue = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = filteredPayments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  const failedAmount = filteredPayments
    .filter(p => p.status === 'failed')
    .reduce((sum, p) => sum + p.amount, 0);

  const transactionCounts = {
    completed: filteredPayments.filter(p => p.status === 'completed').length,
    pending: filteredPayments.filter(p => p.status === 'pending').length,
    refunded: filteredPayments.filter(p => p.status === 'refunded').length,
    failed: filteredPayments.filter(p => p.status === 'failed').length,
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  const exportToCSV = () => {
    const headers = [
      'Transaction ID', 'Order ID', 'Amount', 'Currency', 
      'Payment Method', 'Status', 'Card Type', 'Last 4 Digits',
      'Date', 'User Email'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(p => {
        const orderId = typeof p.orderId === 'object' ? p.orderId?._id : p.orderId;
        const userEmail = typeof p.userId === 'object' 
          ? p.userId?.email 
          : p.billingAddress?.email || 'N/A';
  
        return [
          p.transactionId,
          orderId,
          p.amount,
          p.currency,
          p.paymentMethod,
          p.status,
          p.cardDetails?.cardType || 'N/A',
          p.cardDetails?.lastFourDigits || 'N/A',
          format(new Date(p.createdAt), 'yyyy-MM-dd HH:mm'),
          userEmail
        ].join(',');
      })
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${new Date().toISOString()}.csv`;
    link.click();
  };

  const handleStatusUpdate = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:3030/api/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update payment status');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPayments(payments.map(p => 
          p._id === paymentId ? { ...p, status: newStatus } : p
        ));
        setFilteredPayments(filteredPayments.map(p => 
          p._id === paymentId ? { ...p, status: newStatus } : p
        ));
        setEditingPaymentId(null);
      }
    } catch (error) {
      console.error('Error updating payment status:', error.message);
    }
  };

  const renderStatusCell = (payment) => {
    if (editingPaymentId === payment._id) {
      return (
        <div className="flex items-center gap-2">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="text-xs border rounded p-1"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button 
            onClick={() => handleStatusUpdate(payment._id)}
            className="text-green-600 hover:text-green-800"
          >
            <FaCheck />
          </button>
          <button 
            onClick={() => setEditingPaymentId(null)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTimes />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {payment.status}
        </span>
        <button 
          onClick={() => {
            setEditingPaymentId(payment._id);
            setNewStatus(payment.status);
          }}
          className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaEdit className="text-xs" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment Transactions</h2>
          <div className="flex gap-4">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FaFileExport /> Export CSV
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Total Revenue</h3>
            <p className="text-xl font-semibold text-green-600">$ {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Pending Amount</h3>
            <p className="text-xl font-semibold text-yellow-600">$ {pendingAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Refunded Amount</h3>
            <p className="text-xl font-semibold text-purple-600">$ {refundedAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Failed Transactions</h3>
            <p className="text-xl font-semibold text-red-600">$ {failedAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Transaction Counts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(transactionCounts).map(([status, count]) => (
            <div key={status} className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-gray-500 text-sm">{status.charAt(0).toUpperCase() + status.slice(1)} Transactions</h3>
              <p className="text-xl font-semibold">{count}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>

            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="From Date"
            />

            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="To Date"
            />
          </div>
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Reset all filters
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => {
                    const orderId = typeof payment.orderId === 'object' 
                      ? payment.orderId?._id 
                      : payment.orderId;
                    
                    const userEmail = typeof payment.userId === 'object'
                      ? payment.userId?.email
                      : payment.billingAddress?.email || 'Guest';

                    return (
                      <tr key={payment._id} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.transactionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {orderId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.currency} {payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusCell(payment)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.cardDetails ? 
                            `${payment.cardDetails.cardType || 'Card'} •••• ${payment.cardDetails.lastFourDigits}` : 
                            'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userEmail}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No payments found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} transactions
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
              <button className="px-3 py-1 border rounded-md text-sm bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 border rounded-md text-sm">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTransactions;