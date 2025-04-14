
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
    
    console.log(`🛒 NEW ORDER: User ${req.user.id} is placing an order`);
    console.log(`   Products: ${products.length} items`);
    console.log(`   Total: ${totalAmount}`);
    console.log(`   Payment: ${paymentMethod}`);
    console.log(`   Shipping: ${shippingAddress.city}, ${shippingAddress.state} (${shippingAddress.pincode})`);
    
    if (!products || products.length === 0) {
      console.log(`❌ ORDER FAILED: No order items provided`);
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
    console.log(`   Generated Order ID: ${orderId}`);
    
    const order = new Order({
      user: req.user.id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderId
    });
    
    const createdOrder = await order.save();
    console.log(`✅ ORDER SUCCESS: Order placed! ID: ${orderId}, DB ID: ${createdOrder._id}`);
    console.log(`   Order status: ${createdOrder.status}`);
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(`❌ ORDER ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    console.log(`🛒 MY ORDERS: Fetching orders for user: ${req.user.id}`);
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    
    console.log(`✅ MY ORDERS SUCCESS: Found ${orders.length} orders for user: ${req.user.id}`);
    res.json(orders);
  } catch (error) {
    console.error(`❌ MY ORDERS ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    console.log(`🛒 ADMIN ORDERS: Fetching all orders`);
    const orders = await Order.find({})
      .populate('user', 'username email')
      .populate('products.product')
      .sort({ createdAt: -1 });
    
    console.log(`✅ ADMIN ORDERS SUCCESS: Retrieved ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error(`❌ ADMIN ORDERS ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    console.log(`🛒 ORDER DETAILS: Fetching order ID: ${req.params.id}`);
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('products.product');
    
    if (!order) {
      console.log(`❌ ORDER DETAILS FAILED: Order not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is authorized to view this order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user.id) {
      console.log(`❌ ORDER DETAILS UNAUTHORIZED: User ${req.user.id} tried to access order ${req.params.id}`);
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    console.log(`✅ ORDER DETAILS SUCCESS: Retrieved order: ${req.params.id}`);
    console.log(`   Order status: ${order.status}`);
    console.log(`   Order total: ${order.totalAmount}`);
    res.json(order);
  } catch (error) {
    console.error(`❌ ORDER DETAILS ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`🛒 UPDATE ORDER STATUS: Changing order ${req.params.id} status to: ${status}`);
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log(`❌ UPDATE ORDER STATUS FAILED: Order not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const oldStatus = order.status;
    order.status = status;
    const updatedOrder = await order.save();
    
    console.log(`✅ UPDATE ORDER STATUS SUCCESS: Order ${req.params.id} status changed from ${oldStatus} to ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    console.error(`❌ UPDATE ORDER STATUS ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
