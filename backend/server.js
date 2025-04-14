
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agri_shop_db';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// API health check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Arul Jayam Machinery API is running',
    status: 'OK',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders'
    }
  });
});

// Catch-all route for API 404s
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Serve static files and handle frontend routing

// Path to the dist directory
const distPath = path.join(__dirname, '../dist');

// Check if dist directory exists
const distExists = fs.existsSync(distPath);

if (distExists) {
  // If dist exists, serve static files
  app.use(express.static(distPath));
  
  // For any other request, send the React app's index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If dist doesn't exist, provide a temporary response
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head><title>Arul Jayam Machinery</title></head>
        <body>
          <h1>Arul Jayam Machinery</h1>
          <p>The frontend has not been built yet. Please run 'npm run build' in the project root to create the frontend files.</p>
          <p>For now, you can access the API at <a href="/api">/api</a></p>
        </body>
      </html>
    `);
  });
  
  // Handle other routes when dist doesn't exist
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.redirect('/');
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
