
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
    
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Generate a random order ID
    const generateOrderId = () => {
      const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      return `ORD${randomPart}`;
    };
    
    const order = new Order({
      user: req.user.id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderId: generateOrderId()
    });
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'username email')
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('products.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is authorized to view this order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
