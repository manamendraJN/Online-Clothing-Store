import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin@product' && password === 'product@123') {
      navigate('/admin-product');
    } else if (username === 'admin@order' && password === 'order@123'){
        navigate('/order-admin');
      
    }else {
        setError('Invalid username or password');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Image */}
      <div className="w-3/5 bg-cover bg-center" style={{ backgroundImage: "url('/adminlogin.jpg')" }}></div>
      
      {/* Right Side with Login Form */}
      <div className="w-2/5 flex justify-center items-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-96 h-3/5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default AdminLogin;