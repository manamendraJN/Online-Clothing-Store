import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Usernav() {
  const [userData, setUserData] = useState([]);
  const [image, setImage] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("User"));
    if (user) {
      setUserData(user);
      setImage(user.imagePath);
    }
  }, []);

  return (
    <div className="bg-gray-900">
      <div className="3xl:container 2xl:mx-auto md:py-5 lg:px-20 md:px-6 p-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">Trendora</div>
          <div className="w-full flex justify-center items-center space-x-6">
            <Link to="/user-dashboard" className="text-white hover:text-orange-500 text-base hover:underline">Home</Link>
            <Link to="/filter-user" className="text-white hover:text-orange-500 text-base hover:underline">Category</Link>
            <Link to="" className="text-white hover:text-orange-500 text-base hover:underline">Pages</Link>
            <Link to="" className="text-white hover:text-orange-500 text-base hover:underline">Blog</Link>
            <Link to="" className="text-white hover:text-orange-500 text-base hover:underline">Contact Us</Link>
          </div>
          <div className="flex space-x-5">
                      <Link to="/cart" className="w-40 p-3 bg-blue-500 text-white font-semibold rounded-md text-center">
                                 Cart
                      </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

