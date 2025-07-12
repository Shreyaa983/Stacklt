const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await User.findOne({ email, role: userType }); // <-- check role match too
    if (!user) {
      return res.status(404).json({ msg: 'User not found or role mismatch' });
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

module.exports = { login };
