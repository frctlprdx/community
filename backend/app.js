const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://community-bice.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Izinkan request tanpa origin, misal dari Postman
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked for this origin: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

module.exports = app;
