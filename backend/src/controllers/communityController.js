const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.createCommunity = async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Cek apakah email sudah digunakan
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Buat komunitas baru
    const newCommunity = await prisma.community.create({
      data: {
        name,
      },
    });

    // Buat user dan sambungkan ke komunitas lewat communityId
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone_number,
        role: "COMMUNITY",
      },
    });

    res.status(201).json({
      message: "Komunitas dan user berhasil dibuat",
      community: newCommunity,
      user: newUser,
    });
  } catch (error) {
    console.error("DETAIL ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await prisma.community.findMany();
    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.community.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCommunity = await prisma.community.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
    });

    res.status(200).json({
      message: "Community updated successfully",
      data: updatedCommunity,
    });
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    console.log("=== JOIN COMMUNITY DEBUG ===");
    console.log("Request body:", req.body);

    const { userId, communityId } = req.body;

    if (!userId || !communityId) {
      console.log("Missing userId or communityId");
      return res
        .status(400)
        .json({ message: "userId dan communityId wajib diisi" });
    }

    const userIdInt = parseInt(userId);
    const communityIdInt = parseInt(communityId);

    console.log("Parsed IDs:", { userIdInt, communityIdInt });

    if (isNaN(userIdInt) || isNaN(communityIdInt)) {
      console.log("Invalid number format");
      return res
        .status(400)
        .json({ message: "userId dan communityId harus berupa angka" });
    }

    // Cek apakah user dan community ada
    console.log("Checking user exists...");
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
    });
    console.log("User found:", !!user);

    console.log("Checking community exists...");
    const community = await prisma.community.findUnique({
      where: { id: communityIdInt },
    });
    console.log("Community found:", !!community);

    if (!user) {
      return res.status(400).json({ message: "User tidak ditemukan" });
    }

    if (!community) {
      return res.status(400).json({ message: "Community tidak ditemukan" });
    }

    // Cek membership yang sudah ada
    console.log("Checking existing membership...");
    const existing = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: userIdInt,
          communityId: communityIdInt,
        },
      },
    });
    console.log("Existing membership:", !!existing);

    if (existing) {
      return res
        .status(400)
        .json({ message: "Sudah tergabung di komunitas ini" });
    }

    // Create new membership
    console.log("Creating new membership...");
    const newMember = await prisma.communityMember.create({
      data: {
        userId: userIdInt,
        communityId: communityIdInt,
      },
    });
    console.log("New member created:", newMember);

    res.status(201).json({
      message: "Berhasil bergabung ke komunitas",
      data: newMember,
    });
  } catch (error) {
    console.error("=== ERROR DETAILS ===");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    // Handle Prisma specific errors
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Sudah tergabung di komunitas ini",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "User atau Community tidak ditemukan",
      });
    }

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.communityMember = async (req, res) => {
  try {
    const communityId = parseInt(req.params.id);

    if (isNaN(communityId)) {
      return res.status(400).json({ message: "ID komunitas tidak valid" });
    }

    const members = await prisma.communityMember.findMany({
      where: {
        communityId: communityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });

    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching community members:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const memberId = parseInt(req.params.id);

    const deleted = await db.communityMember.delete({
      where: {
        id: memberId,
      },
    });

    res.status(200).json({ message: "Anggota berhasil dihapus", deleted });
  } catch (error) {
    console.error("Gagal menghapus anggota:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus anggota" });
  }
};
