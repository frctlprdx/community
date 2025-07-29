const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', require('./src/routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
