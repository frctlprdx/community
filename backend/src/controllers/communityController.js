const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.createCommunity = async (req, res) => {
  const { name, email, password } = req.body;

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
    const { userId, communityId } = req.body;

    if (!userId || !communityId) {
      return res
        .status(400)
        .json({ message: "userId dan communityId wajib diisi" });
    }

    // Cek jika sudah tergabung (opsional)
    const existing = await db.community_members.findOne({
      where: { userId, communityId },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Sudah tergabung di komunitas ini" });
    }

    // Simpan ke database
    await db.community_members.create({
      userId,
      communityId,
    });

    res.status(201).json({ message: "Berhasil bergabung ke komunitas" });
  } catch (error) {
    console.error("Error join community:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
