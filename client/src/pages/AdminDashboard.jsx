import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [typeData, setTypeData] = useState([]); // Renamed from brandData to typeData

  useEffect(() => {
    fetchProductStats();
  }, []);

  const fetchProductStats = async () => {
    try {
      const res = await axios.get("http://localhost:3030/products");
      if (res.data.success) {
        const products = res.data.existingProducts;
        setTotalProducts(products.length);
        setTotalQuantity(products.reduce((acc, curr) => acc + parseInt(curr.Quantity), 0));
        setTotalPrice(products.reduce((acc, curr) => acc + (parseInt(curr.Quantity) * parseFloat(curr.Price) || 0), 0));

        // Aggregate quantity by category
        const categoryMap = {};
        products.forEach(product => {
          if (categoryMap[product.Category]) {
            categoryMap[product.Category] += parseInt(product.Quantity);
          } else {
            categoryMap[product.Category] = parseInt(product.Quantity);
          }
        });

        // Convert object to array for category chart
        const categoryChartData = Object.keys(categoryMap).map(category => ({
          category,
          quantity: categoryMap[category]
        }));

        setCategoryData(categoryChartData);

        // Aggregate quantity by Type (top, low, etc.)
        const typeMap = {};
        products.forEach(product => {
          if (typeMap[product.Type]) {
            typeMap[product.Type] += parseInt(product.Quantity);
          } else {
            typeMap[product.Type] = parseInt(product.Quantity);
          }
        });

        // Convert object to array for type chart
        const typeChartData = Object.keys(typeMap).map(type => ({
          type,
          quantity: typeMap[type]
        }));

        setTypeData(typeChartData); // Set type data
      }
    } catch (error) {
      console.error("Error fetching product stats:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-5">
      <div className='bg-red-900 p-3 m-8 mt-2 mb-2 rounded-xl'>
        <h1 className="text-3xl font-bold text-center text-white">Admin Dashboard</h1>
        <p className="mt-2 text-xl text-gray-200 text-center">
          Welcome to the admin dashboard. Manage your products here.
        </p></div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="bg-blue-500 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold">Total Products</h2>
            <p className="text-3xl mt-2">{totalProducts}</p>
          </div>
          <div className="bg-green-500 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold">Total Quantity</h2>
            <p className="text-3xl mt-2">{totalQuantity}</p>
          </div>
          <div className="bg-red-500 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold">Total Price</h2>
            <p className="text-3xl mt-2">Rs. {totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex h-screen">
          {/* Category Bar Chart Section */}
          <div className="w-1/2 mt-5 p-5 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Quantity per Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#058521" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quantity vs Type Bar Chart Section (Horizontal) */}
          <div className="w-1/2 mt-5 p-5 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Quantity per Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#de62c9" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
