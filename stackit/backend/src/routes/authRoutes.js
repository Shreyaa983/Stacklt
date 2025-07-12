const express = require('express');
const router = express.Router();
const {login, signup, getCurrentUser, searchUsersByUsername } = require('../controllers/authController');

// Routes
router.post('/login', login);
router.post('/signup', signup);
router.get('/user/:userId', getCurrentUser);
router.get('/search-users', searchUsersByUsername);

module.exports = router;
