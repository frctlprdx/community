const express = require("express");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(express.json());

module.exports = app;
