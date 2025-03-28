import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { useCart } from '../context/CartContext';

export default function nav() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuSm, setShowMenuSm] = useState(false);
  const [search, setSearch] = useState(false);
  const [userData, setUserData] = useState([]);
  const [image, setImage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate(); // Add this

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("User"));
    if (user) {
      setUserData(user);
      setImage(user.imagePath);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.relative')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem("User");
    setUserData([]);
    setImage("");
    setDropdownOpen(false);
    navigate('/login'); // Add navigation after logout
  };

  const Auth = userData;

  return (
    <div className="bg-gray-900">
      <div className="2xl:container 2xl:mx-auto md:py-5 lg:px-20 md:px-6 p-4">
        <div className="flex items-center justify-between">
          <div className="lg:w-3/12">
            <div className="w-7/12 hidden lg:flex items-center space-x-3 border-b border-gray-200 pb-2">
              <div>
                <svg
                  className="fill-stroke dark:text-gray-600 text-white"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.9984 19.0004L14.6484 14.6504"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for products"
                className="bg-transparent text-sm text-gray-600 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowMenu(true)}
              aria-label="Open Menu"
              className="dark:text-gray-600 text-white  hidden md:block lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-800 rounded"
            >
              <svg
                className="fill-stroke"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 18L4 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 12L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 6L4 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => setSearch(true)}
              aria-label="Search Menu"
              className="dark:text-gray-800 text-white md:hidden focus:outline-none focus:ring-2 focus:ring-gray-800 rounded hover:bg-gray-100 p-0.5"
            >
              <svg
                className="fill-stroke"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.9984 19.0004L14.6484 14.6504"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="lg:w-6/12 flex flex-col justify-center items-center space-y-3.5">
            <div className=" text-2xl font-bold text-orange-600">Trendora</div>
            <div className="hidden lg:block">
              <ul className="flex items-center space-x-10">
                <li>
                  <Link
                    to="/"
                    className="text-white hover:text-orange-500  text-base focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/filter"
                    className="text-white hover:text-orange-500  text-base focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                  >
                    Catageory
                  </Link>
                </li>
                <li>
                  <Link
                    to=""
                    className="text-white hover:text-orange-500  text-base focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                  >
                    Pages
                  </Link>
                </li>
                <li>
                  <Link
                    to=""
                    className="text-white hover:text-orange-500  text-base focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to=""
                    className="text-white hover:text-orange-500  text-base focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:w-3/12 flex justify-end items-center space-x-4">
            <Link to="">
              <div
                aria-label="view favourites"
                className="hidden md:block focus:outline-none dark:text-gray-800 text-white focus:ring-2 focus:ring-gray-800 rounded hover:text-orange-500 p-0.5"
              >
                <svg
                  className="fill-stroke"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
            <Link to="/cart">
              <div className="relative">
                <div
                  aria-label="Shopping bag"
                  className="hidden md:block focus:outline-none dark:text-gray-800 text-white focus:ring-2 focus:ring-gray-800 rounded hover:text-orange-500 p-0.5"
                >
                  <svg
                    className="fill-stroke"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 8.25V6.75C7.5 5.55653 7.97411 4.41193 8.81802 3.56802C9.66193 2.72411 10.8065 2.25 12 2.25V2.25C13.1935 2.25 14.3381 2.72411 15.182 3.56802C16.0259 4.41193 16.5 5.55653 16.5 6.75V8.25M3.75 8.25C3.55109 8.25 3.36032 8.32902 3.21967 8.46967C3.07902 8.61032 3 8.80109 3 9V19.125C3 20.5425 4.2075 21.75 5.625 21.75H18.375C19.7925 21.75 21 20.6011 21 19.1836V9C21 8.80109 20.921 8.61032 20.7803 8.46967C20.6397 8.32902 20.4489 8.25 20.25 8.25H3.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 10.5V11.25C7.5 12.4435 7.97411 13.5881 8.81802 14.432C9.66193 15.2759 10.8065 15.75 12 15.75C13.1935 15.75 14.3381 15.2759 15.182 14.432C16.0259 13.5881 16.5 12.4435 16.5 11.25V10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            {Auth ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:text-orange-500 hidden md:block"
                >
                  {image ? (
                    <img
                      src={image}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <svg
                      className="fill-stroke text-white"
                      width={24}
                      height={24}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                  <span className="text-white">{userData.firstName}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    {userData.role === "admin" ? (
                      <Link
                        to="/admin-product"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/user-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <div className="items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline hidden md:block">
                  <div>
                    <svg
                      className="fill-stroke text-black dark:text-white"
                      width={24}
                      height={24}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-sm">Login</span>
                </div>
              </Link>
            )}
            {/* Mobile responsive*/}
            <button
              onClick={() => setShowMenuSm(true)}
              aria-label="open menu"
              className=" text-white md:hidden focus:outline-none focus:ring-2 focus:ring-gray-800 rounded hover:bg-gray-100 p-0.5"
            >
              <svg
                className="fill-stroke"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 12H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 18H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          id="md-menu"
          className={`${
            showMenu ? "md:block" : ""
          } hidden lg:hidden absolute z-10 inset-0 h-screen w-full dark:bg-gray-800 bg-gray-800 bg-opacity-70 dark:bg-opacity-70`}
        >
          <div className="relative w-full h-screen">
            <div className="absolute inset-0 w-1/2 bg-white dark:bg-gray-900 p-6 justify-center">
              <div className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mx-2">
                  <div>
                    <svg
                      className="fill-stroke text-gray-800 dark:text-white"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.9984 19.0004L14.6484 14.6504"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products"
                    className="text-sm text-gray-300 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  aria-label="close menu"
                  className="focus:outline-none focus:ring-2 focus:ring-gray-800  "
                >
                  <svg
                    className="fill-stroke text-gray-800 dark:text-white"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 4L12 12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-8">
                <ul className="flex flex-col space-y-8">
                  <li className="flex items-center justify-between">
                    <Link
                      to=""
                      className="dark:text-white  text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="flex items-center justify-between">
                    <Link
                      to=""
                      className="dark:text-white  text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    >
                      Catalog
                    </Link>
                  </li>
                  <li className="flex items-center justify-between">
                    <Link
                      to=""
                      className="dark:text-white  text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    >
                      About Us
                    </Link>
                  </li>
                  <li className="flex items-center justify-between">
                    <Link
                      to=""
                      className="dark:text-white  text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="flex items-center justify-between">
                    <Link
                      to=""
                      className="dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    >
                      Contact us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Search menu */}
        <div
          id="mobile-search-menu"
          className={`${
            search ? "flex" : "hidden"
          } md:hidden absolute inset-0 z-10 flex-col w-full h-screen bg-white dark:bg-gray-900 pt-4`}
        >
          <div className="w-full">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mx-4">
              <div className="flex items-center space-x-3 mx-2">
                <div>
                  <svg
                    className="fill-stroke  text-white"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.9984 19.0004L14.6484 14.6504"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for products"
                  className="text-sm text-gray-600 focus:outline-none bg-transparent"
                />
              </div>
              <button
                aria-label="close menu"
                onClick={() => setSearch(false)}
                className="text-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <svg
                  className="fill-stroke"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 5L15 15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full h-full flex items-end">
            <ul className="bg-gray-800 py-10 px-4 flex flex-col space-y-8 w-full">
              <li>
                <Link to="">
                  <div
                    className="flex items-center space-x-2  text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    href=""
                  >
                    <div>
                      <svg
                        className="fill-stroke"
                        width={22}
                        height={22}
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.33333 1L1 5V19C1 19.5304 1.23413 20.0391 1.65087 20.4142C2.06762 20.7893 2.63285 21 3.22222 21H18.7778C19.3671 21 19.9324 20.7893 20.3491 20.4142C20.7659 20.0391 21 19.5304 21 19V5L17.6667 1H4.33333Z"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5H21"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.4436 9C15.4436 10.0609 14.9753 11.0783 14.1418 11.8284C13.3083 12.5786 12.1779 13 10.9991 13C9.82039 13 8.68993 12.5786 7.85643 11.8284C7.02294 11.0783 6.55469 10.0609 6.55469 9"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-base">Cart</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="">
                  <div
                    className="flex items-center space-x-2  text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    href=""
                  >
                    <div>
                      <svg
                        className="fill-stroke"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.3651 3.84172C16.9395 3.41589 16.4342 3.0781 15.8779 2.84763C15.3217 2.61716 14.7255 2.49854 14.1235 2.49854C13.5214 2.49854 12.9252 2.61716 12.369 2.84763C11.8128 3.0781 11.3074 3.41589 10.8818 3.84172L9.99847 4.72506L9.11514 3.84172C8.25539 2.98198 7.08933 2.49898 5.87347 2.49898C4.65761 2.49898 3.49155 2.98198 2.6318 3.84172C1.77206 4.70147 1.28906 5.86753 1.28906 7.08339C1.28906 8.29925 1.77206 9.46531 2.6318 10.3251L3.51514 11.2084L9.99847 17.6917L16.4818 11.2084L17.3651 10.3251C17.791 9.89943 18.1288 9.39407 18.3592 8.83785C18.5897 8.28164 18.7083 7.68546 18.7083 7.08339C18.7083 6.48132 18.5897 5.88514 18.3592 5.32893C18.1288 4.77271 17.791 4.26735 17.3651 3.84172V3.84172Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-base">Wishlist</p>
                  </div>
                </Link>
              </li>
              {Auth ? (
                <li>
                  <Link
                    to={
                      userData.role === "user" ? "/user-dashboard" : "/login"
                    }
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                        <div>
                          <svg
                            className="fill-stroke text-black "
                            width={24}
                            height={24}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </div>
                        <p className="text-base text-gray-200">Login</p>
                      </div>
                    )}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/login">
                    <div className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                      <div>
                        <svg
                          className="fill-stroke text-black "
                          width={24}
                          height={24}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </div>
                      <p className="text-base ">Login</p>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Main Menu */}
        <div
          id="mobile-menu"
          className={`${
            showMenuSm ? "flex" : "hidden"
          } md:hidden absolute inset-0 z-10 flex-col w-full h-screen bg-gray-800 pt-4`}
        >
          <div className="w-full">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mx-4">
              <div />
              <div>
                <p className="dark:text-base font-semibold text-gray-300">Menu</p>
              </div>
              <button
                aria-label="close menu"
                onClick={() => setShowMenuSm(false)}
                className="dark:text-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <svg
                  className="fill-stroke"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 5L15 15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-6 mx-4">
            <ul className="flex flex-col space-y-8">
              <li className="flex items-center justify-between">
                <Link
                  to=""
                  className="  focus:outline-none text-white focus:ring-2 focus:ring-gray-800 hover:underline"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <Link
                  to=""
                  className="  focus:outline-none text-white focus:ring-2 focus:ring-gray-800 hover:underline"
                >
                  Catalog
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <Link
                  to=""
                  className="text-base focus:outline-none text-white focus:ring-2 focus:ring-gray-800 hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <Link
                  to=""
                  className="text-base focus:outline-none text-white focus:ring-2 focus:ring-gray-800 hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <Link
                  to=""
                  className="text-base focus:outline-none text-white focus:ring-2 focus:ring-gray-800 hover:underline"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full h-full flex items-end">
            <ul className="bg-gray-800 py-10 px-4 flex flex-col space-y-8 w-full">
              <li>
                <Link to="">
                  <div
                    className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline"
                    href=""
                  >
                    <div>
                      <svg
                        className="fill-strok text-white"
                        width={22}
                        height={22}
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.33333 1L1 5V19C1 19.5304 1.23413 20.0391 1.65087 20.4142C2.06762 20.7893 2.63285 21 3.22222 21H18.7778C19.3671 21 19.9324 20.7893 20.3491 20.4142C20.7659 20.0391 21 19.5304 21 19V5L17.6667 1H4.33333Z"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5H21"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.4436 9C15.4436 10.0609 14.9753 11.0783 14.1418 11.8284C13.3083 12.5786 12.1779 13 10.9991 13C9.82039 13 8.68993 12.5786 7.85643 11.8284C7.02294 11.0783 6.55469 10.0609 6.55469 9"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-base text-gray-200">Cart</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="">
                  <div
                    className="flex items-center space-x-2 focus:outline-none  focus:ring-2 focus:ring-gray-800 hover:underline"
                    href=""
                  >
                    <div>
                      <svg
                        className="fill-strok text-white"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.3651 3.84172C16.9395 3.41589 16.4342 3.0781 15.8779 2.84763C15.3217 2.61716 14.7255 2.49854 14.1235 2.49854C13.5214 2.49854 12.9252 2.61716 12.369 2.84763C11.8128 3.0781 11.3074 3.41589 10.8818 3.84172L9.99847 4.72506L9.11514 3.84172C8.25539 2.98198 7.08933 2.49898 5.87347 2.49898C4.65761 2.49898 3.49155 2.98198 2.6318 3.84172C1.77206 4.70147 1.28906 5.86753 1.28906 7.08339C1.28906 8.29925 1.77206 9.46531 2.6318 10.3251L3.51514 11.2084L9.99847 17.6917L16.4818 11.2084L17.3651 10.3251C17.791 9.89943 18.1288 9.39407 18.3592 8.83785C18.5897 8.28164 18.7083 7.68546 18.7083 7.08339C18.7083 6.48132 18.5897 5.88514 18.3592 5.32893C18.1288 4.77271 17.791 4.26735 17.3651 3.84172V3.84172Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-base text-gray-200">Wishlist</p>
                  </div>
                </Link>
              </li>
              {Auth ? (
                <li>
                  <Link
                    to={
                        userData.role === "user" ? "/user-dashboard" : "/login"
                    }
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                        <div>
                          <svg
                            className="fill-stroke text-white"
                            width={24}
                            height={24}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </div>
                        <p className="text-base text-gray-200">Login</p>
                      </div>
                    )}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/login">
                    <div className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                      <div>
                        <svg
                          className="fill-stroke text-white"
                          width={24}
                          height={24}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </div>
                      <p className="text-base text-gray-200">Login</p>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
