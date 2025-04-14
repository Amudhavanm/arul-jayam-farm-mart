
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, username } = req.body;
    console.log(`🔵 REGISTER: Attempting to register new user: ${username} (${email})`);
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`❌ REGISTER FAILED: User with email ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User(req.body);
    const savedUser = await user.save();
    
    console.log(`✅ REGISTER SUCCESS: User registered with ID: ${savedUser._id}`);
    console.log(`   Username: ${savedUser.username}`);
    console.log(`   Email: ${savedUser.email}`);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      address: savedUser.address,
      phone: savedUser.phone,
      isAdmin: savedUser.isAdmin,
      profilePicture: savedUser.profilePicture,
      token
    });
  } catch (error) {
    console.error(`❌ REGISTER ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔵 LOGIN: Attempt for email: ${email}`);
    
    // Special case for admin login
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      console.log(`✅ LOGIN SUCCESS: Admin login successful`);
      const token = jwt.sign(
        { id: 'admin123', isAdmin: true },
        process.env.JWT_SECRET || 'mysecretkey',
        { expiresIn: '1d' }
      );
      
      return res.json({
        _id: 'admin123',
        username: 'admin',
        email: 'admin@gmail.com',
        isAdmin: true,
        token
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ LOGIN FAILED: User with email ${email} not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`❌ LOGIN FAILED: Invalid password for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log(`✅ LOGIN SUCCESS: User ${user.username} (${user.email}) logged in`);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1d' }
    );
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
      token
    });
  } catch (error) {
    console.error(`❌ LOGIN ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    console.log(`🔵 PROFILE: Getting profile for user ID: ${req.user.id}`);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log(`❌ PROFILE FAILED: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`✅ PROFILE SUCCESS: Retrieved profile for user: ${user.username}`);
    res.json(user);
  } catch (error) {
    console.error(`❌ PROFILE ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    console.log(`🔵 UPDATE PROFILE: Updating profile for user ID: ${req.user.id}`);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log(`❌ UPDATE PROFILE FAILED: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    
    // Only update password if it's provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    console.log(`✅ UPDATE PROFILE SUCCESS: Profile updated for user: ${updatedUser.username}`);
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error(`❌ UPDATE PROFILE ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(400).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    console.log(`🔵 ADMIN: Getting all users`);
    const users = await User.find({}).select('-password');
    console.log(`✅ ADMIN SUCCESS: Retrieved ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error(`❌ ADMIN ERROR: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
