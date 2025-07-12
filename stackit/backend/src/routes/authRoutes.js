const express = require('express');
const router = express.Router();
const {login } = require('../controllers/authcontroller');

// Routes
router.post('/login', login);

module.exports = router;
