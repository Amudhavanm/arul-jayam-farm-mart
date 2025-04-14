
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAdmin, protect } = require('../middleware/authMiddleware');

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log(`\n============== FETCHING PRODUCTS ==============`);
    const { category, minPrice, maxPrice, search } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
      console.log(`Filter by category: ${category}`);
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
        console.log(`Min price: ${minPrice}`);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
        console.log(`Max price: ${maxPrice}`);
      }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      console.log(`Search term: ${search}`);
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    console.log(`✅ Successfully retrieved ${products.length} products from MongoDB`);
    console.log(`==============================================\n`);
    res.json(products);
  } catch (error) {
    console.error(`❌ PRODUCT FETCH ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    console.log(`\n============== FETCHING PRODUCT DETAILS ==============`);
    console.log(`Product ID: ${req.params.id}`);
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log(`❌ Product not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log(`✅ Successfully retrieved product: ${product.name}`);
    console.log(`==============================================\n`);
    res.json(product);
  } catch (error) {
    console.error(`❌ PRODUCT DETAIL ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Create a product (admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    console.log(`\n============== CREATING NEW PRODUCT ==============`);
    console.log(`Product name: ${req.body.name}`);
    console.log(`Category: ${req.body.category}`);
    console.log(`Price: ${req.body.price}`);
    
    const product = new Product(req.body);
    const savedProduct = await product.save();
    
    console.log(`✅ PRODUCT SUCCESSFULLY ADDED TO MONGODB`);
    console.log(`Product ID: ${savedProduct._id}`);
    console.log(`Product name: ${savedProduct.name}`);
    console.log(`==============================================\n`);
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(`❌ PRODUCT CREATION ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(400).json({ message: error.message });
  }
});

// Update a product (admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    console.log(`\n============== UPDATING PRODUCT ==============`);
    console.log(`Product ID: ${req.params.id}`);
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log(`❌ Product not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log(`✅ PRODUCT SUCCESSFULLY UPDATED IN MONGODB`);
    console.log(`Product ID: ${updatedProduct._id}`);
    console.log(`Product name: ${updatedProduct.name}`);
    console.log(`==============================================\n`);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(`❌ PRODUCT UPDATE ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(400).json({ message: error.message });
  }
});

// Delete a product (admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    console.log(`\n============== DELETING PRODUCT ==============`);
    console.log(`Product ID: ${req.params.id}`);
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log(`❌ Product not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.deleteOne({ _id: req.params.id });
    console.log(`✅ PRODUCT SUCCESSFULLY DELETED FROM MONGODB`);
    console.log(`Product ID: ${req.params.id}`);
    console.log(`Product name: ${product.name}`);
    console.log(`==============================================\n`);
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(`❌ PRODUCT DELETION ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
