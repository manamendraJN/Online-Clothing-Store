import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const ProductAdd = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    ProductName:'',
    Brand: '',
    color: '',
    Quantity: '',
    Category: '',
    Type: '',
    size: '',
    Description: '',
    Price: '',
    URL: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  };
  

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'nhtp0ndy'); 
  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dgyp0h3m9/image/upload', 
      formData
    );

    return response.data.secure_url; 
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
};

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    if (!state.ProductName) {
      newErrors.ProductName = "Product Name is required";
    }
    if (!state.Brand) {
      newErrors.Brand = "Brand is required";
    }
    if (!state.color) {
      newErrors.color = "Color is required";
    }
    if (!state.Quantity) {
      newErrors.Quantity = "Quantity is required";
    }
    if (!state.Category) {
      newErrors.Category = "Category is required";
    }
    if (!state.Type) {
      newErrors.Type = "Type is required";
    }
    if (!state.size) {
      newErrors.size = "Size is required";
    }
    if (!state.Description) {
      newErrors.Description = "Description is required";
    }
    if (!state.Price) {
      newErrors.Price = "Price is required";
    }
    if (!state.URL) {
      newErrors.URL = "Image is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      const { ProductName, Brand, color, Quantity, Category, Type, size, Description, Price, URL} = state;
      const imageUrl = await uploadImageToCloudinary(URL);
      const data = {
        ProductName,
        Brand,
        color,
        Quantity,
        Category,
        Type,
        size,
        Description,
        Price,
        URL:imageUrl
      };
      axios.post("http://localhost:3030/product/save", data)
      .then((res) => {
        if (res.data.success) {
          alert("Product Added Successfully");
          setState({
            ProductName:'',
            Brand: '',
            color: '',
            Quantity: '',
            Category: '',
            Type: '',
            size: '',
            Description: '',
            Price: '',
            URL: ''
            
          });
          navigate('/admin');
        }
      })
    }
  };

  return (

     
  <div className="ml-[16rem] flex h-screen  overflow-hidden">
    <AdminSidebar />
    <div className="flex-grow flex items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('/addpro.jpg')" }}>
  <div className=" w-full bg-cover bg-opacity-0 shadow-lg rounded-lg ">
    <div className='bg-red-900 p-2 m-8 mt-2 mb-2 rounded-xl'>
  <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight flex justify-center p-5">
  Add New Products
 </h2></div>
<div className="mx-auto max-auto px-8  ">
  <form >
    <div className="grid gap-3 mb-4 md:grid-cols-2">
      <div>
        <label htmlFor="product name" className="block mb-2 text-lg font-semibold text-white dark:text-white">Product Name</label>
        <input
            type="text"
            id="ProductName"
            className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="ProductName"
            placeholder="Product Name"
            value={state.ProductName}
            onChange={handleInputChange}
            required
          />
          {errors.ProductName && <p className="text-red-500">{errors.ProductName}</p>}
      </div>
      <div>
        <label htmlFor="brand" className="block mb-2 text-lg font-semibold text-white dark:text-white">Brand</label>
        <input
            type="text"
            id="Brand"
            className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Brand"
            placeholder="Brand"
            value={state.Brand}
            onChange={handleInputChange}
            required
          />
          {errors.Brand && <p className="text-red-500">{errors.Brand}</p>}
      </div>
      <div>
        <label htmlFor="color" className="block mb-2 text-lg font-semibold text-white dark:text-white">Colour</label>
        <input
            type="text"
            id="color"
            className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="color"
            placeholder="Color"
            value={state.color}
            onChange={handleInputChange}
            required
          />
          {errors.color && <p className="text-red-500">{errors.color}</p>}
      </div>
      <div>
        <label htmlFor="quantity" className="block mb-2 text-lg font-semibold text-white dark:text-white">Quantity</label>
        <input
            type="number"
            id="Quantity"
            className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Quantity"
            placeholder="Quantity"
            value={state.Quantity}
            onChange={handleInputChange}
            required
          />
          {errors.Quantity && <p className="text-red-500">{errors.Quantity}</p>}
      </div>
      <div>
        <label htmlFor="category" className="block mb-2 text-lg font-semibold text-white dark:text-white">Category</label>
        <select
            type="text"
            id="Category"
            placeholder="quantity"
            className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Category"
            value={state.Category}
            onChange={handleInputChange}
            required>
          <option value="">Select Category</option>
          <option value="Men">Men</option>
          <option value="Woman">Woman</option>
          <option value="Kids">Kids</option>

         </select> 
          {errors.Category && <p className="text-red-500">{errors.Category}</p>}
      </div>
      <div>
        <label htmlFor="type" className="block mb-2 text-lg font-semibold text-white dark:text-white">Garment Type</label>
        <select
            type="text"
            id="Type"
            className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Type"
            value={state.Type}
            onChange={handleInputChange}
            required>
          <option value="">Select Type</option>
          <option value="Top">Top</option>
          <option value="Lower">Lower</option>

        </select>
          {errors.Type && <p className="text-red-500">{errors.Type}</p>}
      </div>
      <div>
          <label htmlFor="visitors" className="block mb-2 text-lg font-semibold text-white dark:text-white">Size </label>
         <select 
          name="size"
          className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          value={state.size} 
          onChange={handleInputChange} required>
          <option value="">Select Size</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
   

        </select>
          {errors.size && <p className="text-red-500">{errors.size}</p>}
     </div>
     <div>
        <label htmlFor="quantity" className="block mb-2 text-lg font-semibold text-white dark:text-white">Price</label>
        <input
            type="number"
            id="Price"
            className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Price"
            placeholder="Price"
            value={state.Price}
            onChange={handleInputChange}
            required
          />
          {errors.Price && <p className="text-red-500">{errors.Price}</p>}
      </div>

    </div>

    <div>
            <label htmlFor="description" className="block mb-2 text-lg font-semibold text-white dark:text-white">Description</label>
            <textarea id="Description" rows="4" className="block p-2.5 w-full text-sm opacity-80 text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            name="Description"
            placeholder="Enter Product  Details here"
            value={state.Description}
            onChange={handleInputChange} required></textarea>
            {errors.Description && <p className="text-red-500">{errors.Description}</p>}
     </div>
     <div className="mb-6">
            <label htmlFor="url" className="block mb-2 text-lg font-semibold text-white">
              Image Upload
            </label>
            <input
              type="file"
              id="URL"
              className="bg-gray-50 border border-gray-300 opacity-80 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              name="URL"
              onChange={(e) => handleInputChange({ target: { name: 'URL', value: e.target.files[0] } })}
              required
            />
            {errors.URL && <p className="text-red-500">{errors.URL}</p>}
          </div>

    <div className="flex justify-center">
    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-20 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  onClick={onSubmit}>Submit</button>
    </div>


  </form>
  </div>
  <br></br>
</div>
</div>
</div>
    )
  }



  export default ProductAdd;
