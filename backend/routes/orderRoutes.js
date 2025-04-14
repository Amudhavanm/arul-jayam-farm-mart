
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      totalAmount
    } = req.body;
    
    console.log(`⏳ New order being placed by user: ${req.user.id}`);
    console.log(`📦 Order contains ${products.length} product(s)`);
    console.log(`💰 Order total: ${totalAmount}`);
    
    if (!products || products.length === 0) {
      console.log(`❌ Order creation failed: No order items provided`);
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Generate a random order ID
    const generateOrderId = () => {
      const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      return `ORD${randomPart}`;
    };
    
    const orderId = generateOrderId();
    
    const order = new Order({
      user: req.user.id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderId
    });
    
    const createdOrder = await order.save();
    console.log(`✅ Order placed successfully! Order ID: ${orderId}, DB ID: ${createdOrder._id}`);
    console.log(`📍 Shipping to: ${shippingAddress.city}, ${shippingAddress.state} (${shippingAddress.pincode})`);
    console.log(`💳 Payment method: ${paymentMethod}`);
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(`❌ Order creation error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    console.log(`⏳ Fetching orders for user: ${req.user.id}`);
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${orders.length} orders for user: ${req.user.id}`);
    res.json(orders);
  } catch (error) {
    console.error(`❌ Error fetching user orders: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    console.log(`⏳ Admin is fetching all orders`);
    const orders = await Order.find({})
      .populate('user', 'username email')
      .populate('products.product')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Admin fetched ${orders.length} orders from database`);
    res.json(orders);
  } catch (error) {
    console.error(`❌ Error fetching all orders: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    console.log(`⏳ Fetching order details for order ID: ${req.params.id}`);
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('products.product');
    
    if (!order) {
      console.log(`❌ Order not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is authorized to view this order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user.id) {
      console.log(`❌ Unauthorized access to order: ${req.params.id} by user: ${req.user.id}`);
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    console.log(`✅ Successfully fetched order: ${req.params.id}`);
    res.json(order);
  } catch (error) {
    console.error(`❌ Error fetching order details: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`⏳ Admin updating order ${req.params.id} status to: ${status}`);
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log(`❌ Order not found for status update: ${req.params.id}`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    console.log(`✅ Successfully updated order ${req.params.id} status from ${order.status} to ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    console.error(`❌ Error updating order status: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
