// server.js
const app = require("./app");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const postRoutes = require("./src/routes/galleryRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const eventRoutes = require("./src/routes/eventRoutes");

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gallery", postRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/event", eventRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
