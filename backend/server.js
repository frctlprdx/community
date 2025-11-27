const express = require("express");
const cors = require("cors");
const app = require("./app");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const postRoutes = require("./src/routes/galleryRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://community-bice.vercel.app"
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gallery", postRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/event", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
