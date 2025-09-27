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
    const galleries = await prisma.gallery.findMany({
      include: {
        community: {
          select: {
            name: true, // hanya ambil nama komunitas
          },
        },
      },
    });

    // Flatten data supaya community nggak jadi object lagi
    const formattedGalleries = galleries.map((gallery) => ({
      id: gallery.id,
      title: gallery.title,
      description: gallery.description, // 🔥 tambahkan description
      imageUrl: gallery.imageUrl,
      uploadedAt: gallery.uploadedAt,
      communityId: gallery.communityId,
      communityName: gallery.community?.name || null,
    }));

    res.status(200).json(formattedGalleries);
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
    const { title, description, imageUrl, communityId } = req.body;

    // Validasi ID
    const galleryId = parseInt(id);
    if (isNaN(galleryId)) {
      return res.status(400).json({ message: "Invalid gallery ID" });
    }

    // Cek apakah gallery ada
    const existing = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    // Update gallery
    const updatedPost = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description, // ✅ tambahin description
        imageUrl: imageUrl ?? existing.imageUrl,
        communityId: communityId ? parseInt(communityId) : existing.communityId,
      },
    });

    return res.status(200).json({
      message: "Gallery post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGalleryById = async (req, res) => {
  const { id } = req.params;

  try {
    const gallery = await prisma.gallery.findUnique({
      where: {
        id: parseInt(id), // ambil berdasarkan ID galeri, bukan communityId
      },
      include: {
        community: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!gallery) {
      return res.status(404).json({
        status: "error",
        message: "Galeri tidak ditemukan",
      });
    }

    res.json({
      status: "success",
      data: {
        ...gallery,
        communityName: gallery.community?.name || null, // flatten community
      },
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

// Ambil galeri berdasarkan communityId
exports.getCommunityGallery = async (req, res) => {
  const { id } = req.params; // id = communityId

  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        communityId: parseInt(id), // filter by communityId
      },
      include: {
        community: {
          select: {
            name: true, // ambil nama komunitas
          },
        },
      },
      orderBy: {
        uploadedAt: "desc", // urutkan terbaru
      },
    });

    // Format agar lebih rapi
    const formattedGalleries = galleries.map((gallery) => ({
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      imageUrl: gallery.imageUrl,
      uploadedAt: gallery.uploadedAt,
      communityId: gallery.communityId,
      communityName: gallery.community?.name || null,
    }));

    res.status(200).json({
      status: "success",
      data: formattedGalleries,
    });
  } catch (error) {
    console.error("❌ Gagal mengambil galeri komunitas:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil galeri komunitas.",
    });
  }
};
