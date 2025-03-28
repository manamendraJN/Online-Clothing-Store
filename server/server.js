const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./config/config');
const dotenv = require('dotenv');
dotenv.config();
const app = express();


// import defined routes 
const productRoutes = require('./src/Routes/products');
const userRoutes = require('./src/Routes/Auth.routes');
const orderRoutes = require('./src/Routes/orders');
const Payment = require('./src/Routes/payment');

// express instance 



// define port to running server 
const port = process.env.PORT || 3030;

// Enable CORS before route definitions
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'userId'],
  credentials: false
}));

// Parse JSON before route definitions
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// For debugging purposes, add this before routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes configuration
app.use('/orders', orderRoutes);
app.use('/api/payments', Payment);

// Log the registered routes
console.log('Order routes registered at /orders');
console.log('Available routes on /orders:', orderRoutes.stack.map(r => r.route?.path).filter(Boolean));

app.use('/api', userRoutes);
app.use('/', productRoutes);

//default route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Your routes here
app.post("/product/save", (req, res) => {
    res.json({ success: true, message: "Product saved successfully!" });
  });

// port listner
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
   
});



