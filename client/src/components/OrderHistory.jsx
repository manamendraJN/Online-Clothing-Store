import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSearch, FaFilePdf, FaDownload, FaTrash, FaCreditCard, FaTimes } from 'react-icons/fa';
import './OrderHistoryPrintStyles.css';

export default function OrderHistory() {
  // Order management states
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const pdfRef = useRef();

  // Payment related states
  const [paymentForm, setPaymentForm] = useState({
    orderId: null,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('User'));
    if (user && user._id) {
      fetchOrders(user._id);
    } else {
      setLoading(false);
    }
  }, []);

  // Filter orders when search term or category changes
  useEffect(() => {
    if (orders.length === 0) {
      setFilteredOrders([]);
      return;
    }

    const filtered = orders.filter(order => {
      if (!searchTerm.trim()) return true;
      
      const term = searchTerm.toLowerCase();
      
      switch(searchCategory) {
        case 'id':
          return order._id.toLowerCase().includes(term);
        case 'status':
          return order.status.toLowerCase().includes(term);
        case 'date':
          return format(new Date(order.createdAt), 'PPP').toLowerCase().includes(term);
        case 'product':
          return order.items.some(item => 
            item.ProductName.toLowerCase().includes(term)
          );
        case 'all':
        default:
          return (
            order._id.toLowerCase().includes(term) ||
            order.status.toLowerCase().includes(term) ||
            format(new Date(order.createdAt), 'PPP').toLowerCase().includes(term) ||
            order.items.some(item => item.ProductName.toLowerCase().includes(term)) ||
            order.shippingDetails.fullName.toLowerCase().includes(term)
          );
      }
    });

    setFilteredOrders(filtered);
  }, [searchTerm, searchCategory, orders]);

  // Fetch orders from API
  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3030/orders/user/${userId}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        console.error('Invalid order data format:', data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF of order history
  const generatePDF = async () => {
    if (!pdfRef.current || filteredOrders.length === 0) return;
    
    try {
      setGeneratingPdf(true);
      pdfRef.current.classList.add('generating-pdf');
      
      const content = pdfRef.current;
      const canvas = await html2canvas(content, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      pdfRef.current.classList.remove('generating-pdf');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Order History Report', pdfWidth/2, 15, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth/2, 22, { align: 'center' });
      
      pdf.addImage(imgData, 'PNG', imgX, 30, imgWidth * ratio, imgHeight * ratio);
      
      if (imgHeight * ratio > pdfHeight - 40) {
        let pageHeight = pdfHeight - 40;
        for (let i = 1; i <= Math.floor((imgHeight * ratio) / pageHeight); i++) {
          pdf.addPage();
          pdf.addImage(
            imgData, 
            'PNG', 
            imgX, 
            -(pageHeight * i) + 30,
            imgWidth * ratio, 
            imgHeight * ratio
          );
        }
      }
      
      pdf.save(`Order_History_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    if (!orderId) return;
    
    try {
      setDeleteLoading(true);
      const user = JSON.parse(sessionStorage.getItem('User'));
      if (!user || !user._id) {
        throw new Error('You must be logged in to delete orders');
      }
      
      const response = await fetch(`http://localhost:3030/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'userId': user._id
        }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        setFilteredOrders(prevFiltered => prevFiltered.filter(order => order._id !== orderId));
        alert('Order deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`Error deleting order: ${error.message}`);
    } finally {
      setDeleteLoading(false);
      setOrderToDelete(null);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
  };

  const cancelDelete = () => {
    setOrderToDelete(null);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete._id);
    }
  };

  // Payment form handlers
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    
    handlePaymentInputChange({
      target: {
        name: 'cardNumber',
        value: value
      }
    });
  };

  const formatExpiryDate = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    if (value.length > 5) value = value.substring(0, 5);
    
    handlePaymentInputChange({
      target: {
        name: 'expiryDate',
        value: value
      }
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    
    try {
      const user = JSON.parse(sessionStorage.getItem('User'));
      const order = orders.find(o => o._id === paymentForm.orderId);
  
      const paymentData = {
        orderId: paymentForm.orderId,
        userId: user._id,
        paymentMethod: 'credit_card',
        status: 'pending', // Set initial status as pending
        cardDetails: {
          number: paymentForm.cardNumber.replace(/\s/g, ''),
          type: getCardType(paymentForm.cardNumber),
          expiry: paymentForm.expiryDate
        },
        billingAddress: {
          name: paymentForm.nameOnCard,
          email: order.shippingDetails.email,
          address: order.shippingDetails.address,
          city: order.shippingDetails.city,
          postalCode: order.shippingDetails.postalCode
        }
      };
  
      const response = await fetch('http://localhost:3030/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }
  
      setPaymentSuccess(true);
      
      // Update local state - set order status to "pending" instead of "paid"
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o._id === paymentForm.orderId 
            ? { ...o, status: 'pending', paymentId: data.payment._id } 
            : o
        )
      );
      
      setFilteredOrders(prev => 
        prev.map(o => 
          o._id === paymentForm.orderId 
            ? { ...o, status: 'pending', paymentId: data.payment._id } 
            : o
        )
      );
  
      setTimeout(() => {
        closePaymentForm();
      }, 3000);
  
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentSuccess(false);
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  // Helper function to detect card type
  const getCardType = (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'unknown';
  };

  const openPaymentForm = (orderId) => {
    setPaymentForm({
      orderId,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    });
    setPaymentSuccess(null);
  };

  const closePaymentForm = () => {
    setPaymentForm({
      orderId: null,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    });
    setPaymentSuccess(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  if (loading) return (
    <div className="container mx-auto p-6 flex justify-center items-center h-64">
      <div className="text-xl font-semibold">Loading orders...</div>
    </div>
  );

  const hasOrders = filteredOrders.length > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order History</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select 
            value={searchCategory}
            onChange={handleCategoryChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Fields</option>
            <option value="id">Order ID</option>
            <option value="date">Date</option>
            <option value="status">Status</option>
            <option value="product">Product</option>
          </select>
          
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!hasOrders || generatingPdf}
          >
            {generatingPdf ? 'Generating...' : (
              <>
                <FaDownload /> Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {!hasOrders ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
          {searchTerm ? 'No orders match your search criteria' : 'You have no orders yet'}
        </div>
      ) : (
        <div ref={pdfRef} className="space-y-6 bg-white p-4 rounded-lg">
          <div className="hidden print:block mb-6 text-center">
            <h1 className="text-2xl font-bold">Order History Report</h1>
            <p>Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">
                    Date: {format(new Date(order.createdAt), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' && order.paymentId ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'pending' && order.paymentId ? 'Pending Approval' : 
                     order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.status === 'pending' && !order.paymentId && (
                    <button 
                      onClick={() => openPaymentForm(order._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm print:hidden"
                    >
                      <FaCreditCard /> Pay
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteClick(order)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 print:hidden"
                    title="Delete order"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{item.ProductName}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize}, Color: {item.selectedColor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>Qty: {item.quantity}</p>
                      <p>Rs. {item.Price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Shipping to:</p>
                  <p className="font-medium">{order.shippingDetails.fullName}</p>
                  <p className="text-sm text-gray-600">{order.shippingDetails.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingDetails.city}, {order.shippingDetails.postalCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold">Rs. {order.totalAmount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Form Modal */}
      {paymentForm.orderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Complete Payment</h3>
              <button 
                onClick={closePaymentForm}
                className="text-gray-500 hover:text-gray-700"
                disabled={paymentProcessing}
              >
                <FaTimes />
              </button>
            </div>
            
            {paymentSuccess === true ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h4 className="text-xl font-bold mb-2">Payment Submitted!</h4>
                <p className="text-gray-600">Your payment is pending admin approval.</p>
              </div>
            ) : paymentSuccess === false ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-5xl mb-4">✗</div>
                <h4 className="text-xl font-bold mb-2">Payment Failed</h4>
                <p className="text-gray-600">Please try again or use a different payment method.</p>
                <button
                  onClick={() => setPaymentSuccess(null)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={formatCardNumber}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="19"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentForm.expiryDate}
                      onChange={formatExpiryDate}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={handlePaymentInputChange}
                      placeholder="123"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength="4"
                      pattern="\d{3,4}"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={paymentForm.nameOnCard}
                    onChange={handlePaymentInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="font-bold">
                    Amount: Rs. {orders.find(o => o._id === paymentForm.orderId)?.totalAmount || '0.00'}
                  </p>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4 w-full">
            <h3 className="text-lg font-bold mb-4">Delete Order</h3>
            <p className="mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          .generating-pdf {
            background-color: white !important;
            width: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 15mm !important;
          }
        }
      `}</style>
    </div>
  );
}