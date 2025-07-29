const express = require('express');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(express.json());

// Register routes
app.use('/api/', userRoutes);

module.exports = app;
