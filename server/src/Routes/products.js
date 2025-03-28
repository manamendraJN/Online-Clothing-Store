const express = require('express');
const products = require('../models/products');

const router = express.Router();

//save Products

router.post('/product/save',(req,res)=>{

    let newproduct = new products(req.body);

    newproduct.save()
    .then((result)=>{
       
            return res.status(200).json({
                success: 'Post saved successfully',
                product: result
            });
        })
        .catch((error) => {
            return res.status(400).json({
              error: error
        });
    });
});

//get products

router.get('/products',(req,res)=>{
  products.find()
    .then((products)=>{
        return res.status(200).json({
            success: true,
            existingProducts: products
            });
        })
        .catch((error) => {
            return res.status(400).json({
              error: error
        });
    });
});

//update products

router.put('/product/update/:id',(req,res)=>{
  products.findByIdAndUpdate(
        req.params.id,
        {
            $set:req.body
        }).then((post)=>{
            return res.status(200).json({
                success: 'product updated successfully'
              });
            })
            .catch((error) => {
              return res.status(400).json({
                error: error
            });
        });
});

// delete product

router.delete('/product/delete/:id',(req,res)=>{
  products.findByIdAndDelete(req.params.id)
  .then((deletedPost) => {
      return res.status(200).json({
        message: 'product deleted successfully',
        deletedPost: deletedPost
      });
    })
    .catch((error) => {
      return res.status(400).json({
        message: 'product deletion unsuccessful',
        error: error
      });
     });
});


//get a specific product
router.get('/product/:id', (req, res) => {
    let productId = req.params.id;
  
    products.findById(productId)
      .then((product) => {
        return res.status(200).json({
          success: true,
          product:product
        });
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          error: error
        });
      });
  });
  
//   //get products for a specific product
// router.get('/products/:ProductName',(req,res)=>{
//   const ProductId= req.params.ProductId;
//   products.find({ ProductId: ProductId })
//   .then((products)=>{
//       return res.status(200).json({
//           success: true,
//           existingProducts:products
//           });
//       })
//       .catch((error) => {
//           return res.status(400).json({
//             error: error
//       });
//   });
// });
 


module.exports = router;