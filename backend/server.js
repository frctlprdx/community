const app = require("./app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const postRoutes = require("./src/routes/galleryRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const eventRoutes = require("./src/routes/eventRoutes");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gallery", postRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/event", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
