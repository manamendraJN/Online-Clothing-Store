import { useState, useEffect } from 'react';
import { Rating } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductReview from '../components/productReview';
import Nav from "../components/nav";
import { RadioGroup } from '@headlessui/react'
import { useCart } from '../context/CartContext';

const products = {
 
    
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
    { name: 'red', class: 'bg-red-600', selectedClass: 'ring-red-600' },
  ],
  sizes: [
  
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },

  ],}

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  

export default function ProductView() {
  const { id } = useParams(); // Assuming you have a route parameter for product ID
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(products.colors[0])
  const [selectedSize, setSelectedSize] = useState(products.sizes[2])
  const { addToCart } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:3030/product/${id}`)
      .then(response => {
        setProduct(response.data.product); // Assuming your API returns product data in response.data.product
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [id]); // Fetch data when 'id' parameter changes

  if (!product) {
    return <div>Loading...</div>;
  }

  const { URL, Description, Price , size, color , ProductName,Brand,Quantity} = product;
 
  const handleAddToCart = () => {
    addToCart({
      _id: id,
      ProductName,
      Price,
      URL,
      quantity: selectedQuantity,
      selectedSize: selectedSize.name,
      selectedColor: selectedColor.name
    });
  };

  return (
    <>
   <div>
   <Nav/>
   </div>
    <div className="bg-white lg:px-10">
      <div className="pt-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
          {/* Image gallery */}
          <div className="flex flex-col items-center">
            {URL.length > 0 && (
              <div className="overflow-hidden rounded-lg max-w-[40rem] max-h-[40rem] relative">
                <img
                  src={URL}
                  className="h-full w-full object-cover object-center"
                />
                <button className="absolute top-10 right-10 transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
                  3D
                </button>
              </div>
            )}
            <div className="flex flex-wrap space-x-5 justify-center">
              {URL.length > 0 && (
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[7rem] max-h-[7rem] mt-4">
                  <img
                    src={URL}
                    className="h-full w-full object-cover object-center" />
                </div>
              )}
              {URL.length > 0 && (
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[7rem] max-h-[7rem] mt-4">
                  <img
                    src={URL}
                    className="h-full w-full object-cover object-center" />
                </div>
              )}
              {URL.length > 0 && (
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[7rem] max-h-[7rem] mt-4">
                  <img
                    src={URL}
                    className="h-full w-full object-cover object-center" />
                </div>
              )}
            </div>
            
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 maxt-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
            <div className='flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6'>
              <h1 className="text-5xl lg:text-4xl font-bold text-gray-900">{ProductName}</h1>
              <h1 className="text-lg lg:text-xl text-gray-900 opacity-60 pt-1">{Brand}</h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className='flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6'>
                <p className='font-semibold'>RS. {Price}</p>
                <p className='text-green-600 font-semibold'>Stock available {Quantity}</p>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <Rating name="read-only" value={Price} readOnly />
                  <p className="opacity-50 text-sm">{Price} Ratings</p>
                  <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">{Price} Reviews</p>
                </div>
              </div>

            <br></br>
            {/* Colors */}
            <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                  <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                  <div className="flex items-center space-x-3">
                    {products.colors.map((color) => (
                      <RadioGroup.Option
                        key={color.name}
                        value={color}
                        className={({ active, checked }) =>
                          classNames(
                            color.selectedClass,
                            active && checked ? 'ring ring-offset-1' : '',
                            !active && checked ? 'ring-2' : '',
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                          )
                        }
                      >
                        <RadioGroup.Label as="span" className="sr-only">
                          {color.name}
                        </RadioGroup.Label>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.class,
                            'h-8 w-8 rounded-full border border-black border-opacity-10'
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Size guide
                  </a>
                </div>

                <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                  <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    {products.sizes.map((size) => (
                      <RadioGroup.Option
                        key={size.name}
                        value={size}
                        disabled={!size.inStock}
                        className={({ active }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            active ? 'ring-2 ring-indigo-500' : '',
                            'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                            {size.inStock ? (
                              <span
                                className={classNames(
                                  active ? 'border' : 'border-2',
                                  checked ? 'border-indigo-500' : 'border-transparent',
                                  'pointer-events-none absolute -inset-px rounded-md'
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                              >
                                <svg
                                  className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                  viewBox="0 0 100 100"
                                  preserveAspectRatio="none"
                                  stroke="currentColor"
                                >
                                  <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity Selector */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                      className="p-1 bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <select
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                      className="block w-20 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {[...Array(Math.min(10, Quantity))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => setSelectedQuantity(prev => Math.min(Quantity, prev + 1))}
                      className="p-1 bg-gray-100 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                type="submit"
                onClick={handleAddToCart}
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to Cart ({selectedQuantity})
              </button>
            </div>

            {/* Description and details */}
            <div >
              <div className="mt-10">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Description</h3>
                <p className="text-base text-gray-900">{Description}</p>
              </div>
{/* 
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {highlights.map((highlight, index) => (
                      <li key={index} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}

              {/* <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>
                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{details}</p>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* Ratings and Reviews */}
        <ProductReview />
      </div>
    </div>
    </>
  );
}
