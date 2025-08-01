const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend Vite URL
    credentials: true, // jika pakai cookie atau auth headers
  })
);
app.use(express.json());

module.exports = app;
