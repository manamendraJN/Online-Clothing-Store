
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

function ProductEdit(props) {
  const [ProductName, setProductName] = useState("");
  const [Brand, setBrand] = useState("");
  const [color, setcolor] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Category, setCategory] = useState("");
  const [Type, setType] = useState("");
  const [size, setsize] = useState("");
  const [Price, setPrice] = useState("");
  const [Description, setDescription] = useState("");
  const [URL, setURL] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3030/product/${id}`).then((res)=>{
      if(res.data.success){
        setProductName(res.data.product.ProductName);
        setBrand(res.data.product.Brand);
        setcolor(res.data.product.color);
        setQuantity(res.data.product.Quantity);
        setCategory(res.data.product.Category);
        setType(res.data.product.Type);
        setsize(res.data.product.size);
        setPrice(res.data.product.Price);
        setDescription(res.data.product.Description);
        setURL(res.data.product.URL);
      }
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "ProductName") {
      setProductName(value);
    } else if (name === "Brand") {
      setBrand(value);
    } else if (name === "color") {
      setcolor(value);
    } else if (name === "Quantity") {
      setQuantity(value);
    } else if (name === "Category") {
        setCategory(value);
    } else if (name === "Type") {
        setType(value);
    } else if (name === "size") {
        setsize(value);
    } else if (name === "Price") {
        setPrice(value);    
    } else if (name === "Description") {
        setDescription(value);
    } else if (name === "URL") {
        setURL(value);
    }
     // Clear specific error message
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: ''
  }));
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Validate all fields
    if (!ProductName) {
        newErrors.ProductName = "Product Name is required";
      }
      if (!Brand) {
        newErrors.Brand = "Brand is required";
      }
      if (!color) {
        newErrors.color = "Color is required";
      }
      if (!Quantity) {
        newErrors.Quantity = "Quantity is required";
      }
      if (!Category) {
        newErrors.Category = "Category is required";
      }
      if (!Type) {
        newErrors.Type = "Type is required";
      }
      if (!size) {
        newErrors.size = "Size is required";
      }
      if (!Price) {
        newErrors.Price = "Price is required";
      }

      if (!Description) {
        newErrors.Description = "Description is required";
      }
      if (!URL) {
        newErrors.URL = "URL is required";
      }
  
      setErrors(newErrors);
  
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  

  const onSubmit = (e) => {
    e.preventDefault();
    
    
  if (validateForm()) {
    const data = {
        ProductName:ProductName,
        Brand:Brand,
        color:color,
        Quantity:Quantity,
        Category:Category,
        Type:Type,
        size:size,
        Price:Price,
        Description:Description,
        URL:URL
    };

   
    
    axios.put(`http://localhost:3030/product/update/${id}`, data).then((res) => {
      if (res.data.success) {
        alert("Product Update Successfully");
        setProductName("");
        setBrand("");
        setcolor("");
        setQuantity("");
        setCategory("");
        setType("");
        setsize("");
        setPrice("");
        setDescription("");
        setURL("");
        navigate('/admin');
      }
    });
  }
  };

  return (
    <div className="min-w-0 flex-1 bg-orange-900 ">
      <div>
    <br></br>
    <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight mb-10 flex justify-center ">
    Edit Product
   </h2>
  
  <div className="mx-auto max-auto px-8  shadow-md shadow-gray-600 rounded-md bg-white mr-20 ml-20 ">
    <br></br>
<form >
    <div className="grid gap-6 mb-6 md:grid-cols-2 " >
      <div>
        <label htmlFor="product name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
        <input
            type="text"
            id="ProductName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="ProductName"
            placeholder="ProductName"
            value={ProductName}
            onChange={handleInputChange}
            required
          />
          {errors.ProductName && <p className="text-red-500">{errors.ProductName}</p>}
      </div>
      <div>
        <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
        <input
            type="text"
            id="Brand"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Brand"
            placeholder="brand"
            value={Brand}
            onChange={handleInputChange}
            required
          />
          {errors.Brand && <p className="text-red-500">{errors.Brand}</p>}
      </div>
      <div>
        <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Colour</label>
        <input
            type="text"
            id="color"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="color"
            placeholder="color"
            value={color}
            onChange={handleInputChange}
            required
          />
          {errors.color && <p className="text-red-500">{errors.color}</p>}
      </div>
      <div>
        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
        <input
            type="number"
            id="Quantity"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Quantity"
            placeholder="quantity"
            value={Quantity}
            onChange={handleInputChange}
            required
          />
          {errors.Quantity && <p className="text-red-500">{errors.Quantity}</p>}
      </div>
      <div>
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
        <select
            type="text"
            id="Category"
            placeholder="quantity"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Category"
            value={Category}
            onChange={handleInputChange}
            required>
          <option value="">Select Category</option>
          <option value="Men">Men</option>
          <option value="Woman">Woman</option>

         </select> 
          {errors.Category && <p className="text-red-500">{errors.Category}</p>}
      </div>
      <div>
        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Garment Type</label>
        <select
            type="text"
            id="Type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Type"
            value={Type}
            onChange={handleInputChange}
            required>
          <option value="">Select Type</option>
          <option value="Top">Top</option>
          <option value="Lower">Lower</option>

        </select>
          {errors.Type && <p className="text-red-500">{errors.Type}</p>}
      </div>
      <div>
          <label htmlFor="visitors" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Size </label>
         <select 
          name="size"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          value={size} 
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
        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
        <input
            type="number"
            id="Price"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="Price"
            placeholder="price"
            value={Price}
            onChange={handleInputChange}
            required
          />
          {errors.Price && <p className="text-red-500">{errors.Price}</p>}
      </div>
   
     </div>


    <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea id="Description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            name="Description"
            placeholder="Enter Product  Details here"
            value={Description}
            onChange={handleInputChange} required></textarea>
            {errors.Description && <p className="text-red-500">{errors.Description}</p>}
     </div>
    <div className="mb-6">
      <label htmlFor="url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Picture URL</label>
      <input
            type="text"
            id="URL"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="URL"
            placeholder="picture url"
            value={URL}
            onChange={handleInputChange}
            required
          />
          {errors.URL && <p className="text-red-500">{errors.URL}</p>}
    </div>

    <div className="flex justify-center">
    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-20 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-5"
  onClick={onSubmit}>Update</button>
    </div>


  </form>

  </div>
  <br></br>
  </div>
</div>
    )
  }

export default ProductEdit;