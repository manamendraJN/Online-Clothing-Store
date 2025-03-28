import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from "../components/AdminSidebar";


function Plist() {
  const [products, setProducts] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    retrieveProducts();
  }, []);

  // Fetch product data
  const retrieveProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3030/products');
      if (res.data.success) {
        setProducts(res.data.existingProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Delete product
  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3030/product/delete/${id}`);
      alert('Product deleted successfully');
      retrieveProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Filter products based on search
  const handleSearch = (e) => {
    const key = e.target.value.toLowerCase();
    setSearchKey(key);

    axios.get('http://localhost:3030/products').then((res) => {
      if (res.data.success) {
        const filtered = res.data.existingProducts.filter((product) =>
          Object.values(product).some((val) =>
            val.toString().toLowerCase().includes(key)
          )
        );
        setProducts(filtered);
      }
    });
  };

  const totalQuantity = products.reduce((acc, curr) => acc + parseInt(curr.Quantity), 0);
  const totalPrice = products.reduce((acc, curr) => acc + (parseInt(curr.Quantity) * parseFloat(curr.Price) || 0), 0);

  return (
    <div className="flex h-screen">
       <AdminSidebar />
        <div
          className="bg-repeat-y bg-cover bg-center"
          style={{
            backgroundImage: "url('/plist.jpg')",
            backgroundRepeat: "repeat-y", 
            backgroundSize: "cover", 
            minHeight: "100vh"
          }}
        >
          {/* Overlay for better contrast */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>

          <div className="container mx-auto px-3 py-10 relative">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-3xl font-extrabold text-white">Product List</h3>
              <input
                type="search"
                placeholder="Search products..."
                value={searchKey}
                onChange={handleSearch}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product Table */}
            <div className="bg-transparent shadow-lg rounded-lg p-4">
              <div className="flex items-center text-lg font-bold text-white mb-4">
                <div className='mx-auto p-3'>
                  Total Products:
                  <span className="ml-2 px-3 py-1 bg-blue-500 text-white text-xl font-bold rounded-lg shadow-md p-5">
                    {products.length}
                  </span>
                </div>
                <div className='mx-auto p-3'>
                  Total Quantity:
                  <span className="ml-2 px-3 py-1 bg-blue-500 text-white text-xl font-bold rounded-lg shadow-md">
                    {totalQuantity}
                  </span>
                </div>
                <div className='mx-auto p-3'>
                  Total Price:  
                  <span className="ml-2 px-3 py-1 bg-blue-500 text-white text-xl font-bold rounded-lg shadow-md">
                    Rs. {totalPrice}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-md text-gray-100 border-collapse">
                  <thead className="bg-black bg-opacity-80 text-white uppercase font-extrabold">
                    <tr>
                      {['Product Name', 'Brand', 'Color', 'Quantity', 'Category', 'Garment Type', 'Size', 'Price', 'Actions'].map(
                        (header) => (
                          <th key={header} className="px-6 py-4 text-left border-b-2 border-black">
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product, index) => (
                        <tr
                          key={product._id}
                          className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-200 bg-opacity-40' : 'bg-gray-500 bg-opacity-20'} hover:bg-gray-400 hover:bg-opacity-30 transition`}
                        >
                          <td className="px-6 py-4 font-semibold text-white">{product.ProductName}</td>
                          <td className="px-6 py-4 font-semibold">{product.Brand}</td>
                          <td className="px-6 py-4 font-semibold">{product.color}</td>
                          <td className="px-6 py-4 font-bold text-yellow-400">{product.Quantity}</td>
                          <td className="px-6 py-4 font-semibold">{product.Category}</td>
                          <td className="px-6 py-4 font-semibold">{product.Type}</td>
                          <td className="px-6 py-4 font-semibold">{product.size}</td>
                          <td className="px-6 py-4 font-bold text-green-400">Rs.{product.Price}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <button
                              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                              onClick={() => onDelete(product._id)}
                            >
                              Delete
                            </button>
                            <a
                              href={`/pedit/${product._id}`}
                              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                            >
                              Update
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-gray-300 font-semibold">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
export default Plist;
