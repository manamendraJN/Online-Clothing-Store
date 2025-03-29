const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./config/config'); // Ensure this connects to your MongoDB
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Import routes
const productRoutes = require('./src/Routes/products');
const userRoutes = require('./src/Routes/Auth.routes');
const orderRoutes = require('./src/Routes/orders');
const paymentRoutes = require('./src/Routes/payment');

// Define port
const port = process.env.PORT || 3030;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'userId'],
  credentials: false
}));

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', userRoutes);
app.use('/', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});