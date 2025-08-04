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
        communityId: newCommunity.id, // relasi ke komunitas
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
    const { id } = req.params;
    const { userId } = req.body; // ID user yang ingin bergabung

    // Cek apakah komunitas ada
    const community = await prisma.community.findUnique({
      where: { id: parseInt(id) },
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Tambahkan user ke komunitas
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { communityId: community.id },
    });

    res.status(200).json({ message: "User joined the community successfully" });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
