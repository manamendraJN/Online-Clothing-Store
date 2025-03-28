// import { useState } from "react";
// import Nav from "./Navigation/Nav.jsx"
// import Products from "./Products/Products.jsx"
// //import Recomm from "./Recomm/Recomm.jsx";
// import Sidebar from "./Sidebar/sidebar.jsx"
// import products from "./assets/data.jsx";
// import Card from "./components/Card.jsx"
// import "./index.css";
// function Filter() {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [qry, setQry] = useState("");

//   //assingning id property to each product
//   let newProducts = products.map((item, index) => {
//     return { id: index + 1, ...item };
//   });

//   //....input filter...//
//   const handleInputChange = (event) => {
//     setQry(event.target.value);
//   };

//   //... radio filter...//
//   const handleChange = (event) => {
//     setSelectedCategory(event.target.value);
//   };

//   //... Button filter...//
//   const handleClick = (event) => {
//     setSelectedCategory(event.target.value);
//   };

//   function filteredData(newproducts, selected, query) {
//     let filteredProducts = newproducts;

//     // Filtering input items
//     if (query) {
//       filteredProducts = filteredProducts.filter(
//         (product) =>
//           product.ProductName
//             .toLocaleLowerCase()
//             .indexOf(query.toLocaleLowerCase()) !== -1
//       );
//     }
//     //selected filter
//     if (selected) {
//       filteredProducts = filteredProducts.filter(
//         ({ Category, color, ProductName, Price, Brand }) =>
//           Category === selected ||
//           color === selected ||
//           ProductName === selected ||
//           Price=== selected ||
//           Brand === selected
//       );
//     }
//     return filteredProducts.map(
//       ({ id,URL, ProductName, Brand,  Price}) => (
//         <Card
//           key={id}
//           id={id}
//           URL={URL}
//           ProductName={ProductName}
//           Brand={Brand}
//           Price={Price}
        
//         />
//       )
//     );
//   }

//   const result = filteredData(newProducts, selectedCategory, qry);

//   return (
//     <>
//       <Sidebar handleChange={handleChange} />
//       <Nav query={qry} handleInputChange={handleInputChange} />
//       {/*<Recomm handleClick={handleClick} />*/}
//       <Products result={result} />
//     </>
//   );
// }

// export default Filter;
import React, { useState, useEffect } from "react";
import Products from "./Products/Products.jsx";
import Sidebar from "./Sidebar/sidebar.jsx";
import Card from "./components/Card.jsx";
import "./index.css";
import UserNav from "./components/usernav.jsx";

function UserFilter() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [qry, setQry] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch products when the component mounts

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3030/products"); // Assuming your backend API endpoint for fetching products is /api/products
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.existingProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle input change
  const handleInputChange = (event) => {
    setQry(event.target.value);
  };

  // Handle radio change
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function filteredData(products, selected, query) {
    let filteredProducts = products;

    // Filtering input items
    if (query) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.ProductName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }

    // Selected filter including Price as a range
    if (selected) {
      filteredProducts = filteredProducts.filter(
        ({ Category, color, ProductName, Price, Brand }) => {
          if (Category === selected || color === selected || ProductName === selected || Brand === selected) {
            return true;
          }

          // Convert `selected` to number for price filtering
          const selectedPrice = Number(selected);
          if (!isNaN(selectedPrice)) {
            if (selectedPrice === 500) return Price <= 500;
            if (selectedPrice === 1500) return Price > 500 && Price <= 1500;
            if (selectedPrice === 2999) return Price > 1000 && Price <= 3000;
            if (selectedPrice === 3000) return Price > 3000;
          }

          return false;
        }
      );
    }

    return filteredProducts.map(
      ({ _id, URL, ProductName, Brand, Price }) => (
        <Card
          key={_id}
          id={_id}
          URL={URL}
          ProductName={ProductName}
          Brand={Brand}
          Price={Price}
        />
      )
    );
  }

  const result = filteredData(products, selectedCategory, qry);

  return (
    <>
      <UserNav />
      <Sidebar handleChange={handleChange} />
      <Products result={result} />
    </>
  );
}

export default UserFilter;

