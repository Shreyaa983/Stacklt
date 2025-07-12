const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check for required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const user = await User.findOne({ 
      username: name, 
      email: email, 
      role: userType 
    });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found or credentials mismatch' });
    }

    if (user.password !== password) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    res.json({
      msg: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check for required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      msg: 'User fetched successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Search users by username (for mention autocomplete)
const searchUsersByUsername = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 1) {
      return res.status(400).json({ msg: 'Query parameter is required' });
    }
    // Case-insensitive, partial match
    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    }, 'username email'); // Only return username and email
    res.status(200).json({
      msg: 'Users fetched successfully',
      users
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = { login, signup, getCurrentUser, searchUsersByUsername };
