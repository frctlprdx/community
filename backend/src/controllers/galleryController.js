const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  try {
    const { title, imageUrl, communityId } = req.body;

    // Validasi input
    if (!title) {
      return res
        .status(400)
        .json({ message: "Title dan communityId wajib diisi." });
    }

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        imageUrl,
        communityId: parseInt(communityId),
      },
    });

    res.status(201).json({
      message: "Gallery post created successfully",
      data: newGallery,
    });
  } catch (error) {
    console.error("Error creating gallery:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany();

    res.status(200).json(galleries); // ⬅️ langsung kirim array, bukan dibungkus object
  } catch (error) {
    console.error("Gagal mengambil galeri:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil galeri." });
  }
};

exports.destroyPost = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPost = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    await prisma.gallery.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Gallery post deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, communityId } = req.body;

    // Cek apakah post ada
    const existing = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    const updatedPost = await prisma.gallery.update({
      where: { id: parseInt(id) },
      data: {
        title,
        imageUrl,
        communityId: parseInt(communityId),
      },
    });

    res.status(200).json({
      message: "Gallery post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGalleryById = async (req, res) => {
  const { id } = req.params;

  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        communityId: parseInt(id),
      },
      orderBy: {
        uploadedAt: "desc", // optional: untuk urutkan terbaru ke lama
      },
    });

    res.json({
      status: "success",
      data: galleries,
    });
  } catch (error) {
    console.error("❌ Gagal mengambil galeri:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil galeri.",
    });
  }
};

exports.getGalleryDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const gallery = await prisma.gallery.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!gallery) {
      return res.status(404).json({
        status: "error",
        message: "Galeri tidak ditemukan",
      });
    }

    res.status(200).json(gallery);
  } catch (error) {
    console.error("❌ Gagal mengambil detail galeri:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil detail galeri",
    });
  }
};
