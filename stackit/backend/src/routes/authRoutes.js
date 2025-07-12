const express = require('express');
const router = express.Router();
const {login, signup, getCurrentUser } = require('../controllers/authController');

// Routes
router.post('/login', login);
router.post('/signup', signup);
router.get('/user/:userId', getCurrentUser);

module.exports = router;
