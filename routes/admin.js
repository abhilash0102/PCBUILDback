// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Remove the adminAuth middleware and use a simplified version
// that doesn't check for admin role
const simpleAuth = async (req, res, next) => {
  try {
    // Just use the regular auth middleware
    auth(req, res, next);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/admin/users
// @desc    Get all users
// @access  Now available to any authenticated user
router.get('/users', simpleAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/users/:id
// @desc    Get user by ID
// @access  Now available to any authenticated user
router.get('/users/:id', simpleAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/users/:id
// @desc    Update user
// @access  Now available to any authenticated user
router.put('/users/:id', simpleAuth, async (req, res) => {
  try {
    const { username, email, role, active } = req.body;
    
    // Build user object
    const userFields = {};
    if (username) userFields.username = username;
    if (email) userFields.email = email;
    if (role) userFields.role = role;
    if (active !== undefined) userFields.active = active;
    
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user
// @access  Now available to any authenticated user
router.delete('/users/:id', simpleAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    await User.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(500).send('Server error');
  }
});

module.exports = router;