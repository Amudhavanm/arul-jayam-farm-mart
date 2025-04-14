
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
const MONGO_URI = 'mongodb://localhost:27017/agri_shop_db';
console.log(`⏳ Attempting to connect to MongoDB at: ${MONGO_URI}`);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🔌 MongoDB connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Log all API requests
app.use((req, res, next) => {
  console.log(`🔄 ${req.method} request to ${req.originalUrl}`);
  next();
});

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
  console.log(`❌ 404: API endpoint not found - ${req.originalUrl}`);
  res.status(404).json({ message: 'API endpoint not found' });
});

// Serve static files and handle frontend routing
const distPath = path.join(__dirname, '../dist');
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
  console.error(`❌ Server error: ${err.stack}`);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
📡 API available at http://localhost:${PORT}/api
🌐 Frontend available at http://localhost:${PORT}
  `);
});
