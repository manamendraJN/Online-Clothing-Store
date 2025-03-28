import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importing Components
//importing authentication management
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPW from './pages/ForgotPW';
import Reset from './pages/Reset';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/userDashboard';
import EditUser from './components/editUser';
import Home from './pages/home';
import Filter from './Filter';

//Auth checking
import AdminAuth from './components/adminAuth';
import UserAuth from './components/userAuth';

//Importing product management
import AdminLogin from"./pages/adminlogin";
import ProductAdd from './pages/ProductAdd';
import Plist from "./pages/productlist";
import ProductView from "./pages/productView";
import ProductEdit from './pages/ProductEdit';
import Products from './pages/products';

import UserFilter from './userfiler';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import Payment from './pages/paymentTransactionList';
import ClientTransactions from './pages/clientTransaction';

export default function App() {
  return (
    <CartProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPW />} />
            <Route path="/reset/:token" element={<Reset />} />
            <Route path="/admin-product" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserAuth><UserDashboard /></UserAuth>} />
            <Route path="/user-dashboard/:id" element={<EditUser />} />
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Navigate to="/login" />} /> 
            <Route path="/add" element={<ProductAdd />} /> 
            <Route path="/plist" exact element={<Plist />} /> 
            <Route path="/pview/:id" exact element={<ProductView />} />         
            <Route path="/pedit/:id" exact element={<ProductEdit />} />
            <Route path="/admin-login" exact element={<AdminLogin />} /> 
            <Route path="/filter" exact element={<Filter />} />
            <Route path="/filter-user" exact element={<UserFilter />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/my-transactions" element={<ClientTransactions />} />
            <Route path="/checkout" element={<UserAuth><Checkout /></UserAuth>} />
            <Route path="/profile" element={<UserAuth><EditUser /></UserAuth>} />
            
          </Routes>
        </Router>
      </div>
    </CartProvider>
  );
}
