import React ,{useState,useEffect} from 'react';
import { Link } from "react-router-dom";
import EditUser from './editUser';
import {logout} from '../API/Auth.controller';
import ProductAdd from '../pages/ProductAdd';
import ProductList from '../pages/productlist';
import ProductEdit from '../pages/ProductEdit';
import Img1 from "../assets/img1.png";
import AdminChart from './adminChart';
import OrderHistory from './OrderHistory';

export default function sideBar() {


    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState("Dashboard");
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [image, setImage] = useState('');
  
    const toggleSidebar = () => {
      setSidebarOpen((prevState) => !prevState);
    };
  
    const toggleUserMenu = () => {
      setUserMenuOpen((prevState) => !prevState);
    };
  
    const handleSidebarItemClick = (item) => {
      setSelectedContent(item);
    };


    useEffect(() => {
      const user = JSON.parse(sessionStorage.getItem('User'));
      if (user) {
        setUserData(user);
        setFName(user.firstName);
        setLName(user.lastName);
        setEmail(user.email);
        setId(user._id);
        setImage(user.imagePath);
      }
    }, []);


    const logoutHandler = async (e)=>{
      e.preventDefault();
      try{
        const res = await logout();
        sessionStorage.removeItem('User');
        console.log(res);
        window.location.href = '/';
      }
      catch(error){
        console.log(error);
      }
    };
  
    return (
      <>
      {/** nav */}
        <nav className="fixed top-0 z-50 w-full bg-orange-900 border-b border-gray-800 dark:bg-orange-900 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <button
                  onClick={toggleSidebar}
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Toggle Sidebar</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                  </svg>
                </button>
                <Link to="/" className="flex ms-2 md:me-24">
                  <img
                    src={Img1}
                    className="h-8 me-3"
                    alt="Logo"
                  />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
                    Trendora
                  </span>
                </Link>
              </div>
              
              {/* nav user */}
              <div className="flex items-center">
                <div className="relative">
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded={userMenuOpen}
                    onClick={toggleUserMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src={image}
                      alt="user photo"
                    />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-5 w-24 py-2 bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                      
                      <button
                        onClick={logoutHandler}
                        className=" block px-1 mx-auto py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/** side nav */}
        <aside
          id="logo-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }  border-r border-gray-200 sm:translate-x-0 bg-orange-900 dark:border-gray-700`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-orange-900 text-white">
            <ul className="space-y-2 font-medium">
              <li
                className={`px-4 py-2 transition-colors duration-300 cursor-pointer hover:bg-gray-100  hover:text-black dark:hover:bg-gray-700 ${selectedContent === "Dashboard" ? 'text-black bg-gray-100' : ''}`}
                onClick={() => handleSidebarItemClick("Dashboard")}
              >
                <Link to=''>Dashboard</Link>
              </li>
              {/* <li
                className={`px-4 py-2 transition-colors duration-300 cursor-pointer hover:bg-gray-100  hover:text-black dark:hover:bg-gray-700 ${selectedContent === "users" ? 'text-black bg-gray-100' : ''}`}
                onClick={() => handleSidebarItemClick("users")}
              >
                <Link to= ''>Users</Link>
              </li> */}
              <li
                className={`px-4 py-2 transition-colors duration-300 cursor-pointer hover:bg-gray-100  hover:text-black dark:hover:bg-gray-700 ${selectedContent === "payments" ? 'text-black bg-gray-100' : ''}`}
                onClick={() => handleSidebarItemClick("payments")}
              >
                <Link to= ''>Payments</Link>
              </li>
              <li
                className={`px-4 py-2 transition-colors duration-300 cursor-pointer hover:bg-gray-100  hover:text-black dark:hover:bg-gray-700 ${selectedContent === "Add Product" ? 'text-black bg-gray-100' : ''}`}
                onClick={() => handleSidebarItemClick("Add Product")}
              >
                <Link to=''>Products</Link>
              </li> <li
                className={`px-4 py-2 transition-colors duration-300 cursor-pointer hover:bg-gray-100  hover:text-black dark:hover:bg-gray-700 ${selectedContent === "Product List" ? 'text-black bg-gray-100' : ''}`}
                onClick={() => handleSidebarItemClick("Product List")}
              >
                <Link to=''>Product List</Link>
              </li>

              <li
                className={`px-4 py-2 transition-colors duration-300 cursor-pointer hover:bg-gray-100  hover:text-black dark:hover:bg-gray-700 ${selectedContent === "Profile" ? 'text-black bg-gray-100' : ''}`}
                onClick={() => handleSidebarItemClick("Profile")}
              >
                <Link to=''>Profile</Link>
              </li>
              <li className=''>
              <button
                className='px-4 py-2 w-full transition-colors duration-300 cursor-pointer hover:bg-red-500  hover:text-white text-red-200 rounded-xl  border-red-700'
                onClick={logoutHandler}
              >
                LogOut
              </button>
              </li>
            </ul>

            



             {/* User Div */}

       
    <div className="absolute bottom-0 left-0 w-full pb-8 mx-2 pt-6 flex justify-start items-center space-x-2">
      <div className=' bg-slate-700 flex p-5 rounded-xl gap-4 border-white'>
      <div>
        <img src={image} alt="avatar"className='w-10 h-10 rounded-full' />
      </div>
      <div className="flex flex-col justify-start items-start space-y-1">
        <p className="cursor-pointer text-base leading-4 text-white">{fName} {lName}</p>
        <p className="cursor-pointer text-xs leading-3 text-indigo-200">{email}</p>
      </div>
    </div>
    
    </div>


          </div>
        </aside>

        {/** main content */}
        <div className="p-4 mt-14 sm:ml-64">
          {/* Conditional rendering based on selectedContent state */}
          {selectedContent === "Dashboard" && (
            <div>
              {/* Dashboard component */}
      
              <AdminChart/>
              
            </div>
          )}
          {/* {selectedContent === "users" && (
            <div>
             
              <h2>users Component</h2>
              
            </div>
          )} */}
          {selectedContent === "payments" && (
            <div>
              {/* payment component */}
              <h2>payment Component</h2>
            </div>
          )}
          {selectedContent === "Add Product" && (
            <div>
              {/* stock component */}
              <ProductAdd />
            </div>
          )}
           {selectedContent === "Product List" && (
            <div>
              {/* Profile component */}
              <ProductList/>
             
            </div>
          )}
          {selectedContent === "Profile" && (
            <div>
              {/* Profile component */}
              <EditUser userId={id}/>
             
            </div>
          )}
          {selectedContent === "Product Edit" && (
            <div>
              {/* Profile component */}
              <ProductEdit/>
             
            </div>
          )}
          {selectedContent === "Orders" && (
            <div>
              <OrderHistory />
            </div>
          )}
        </div>
      </>
  );
}
