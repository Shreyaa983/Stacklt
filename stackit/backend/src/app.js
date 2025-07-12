const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Mount login route
app.use('/api/auth', authRoutes);
// Mount question routes
app.use('/api/questions', questionRoutes);

module.exports = app;
