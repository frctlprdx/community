const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllCommunities = async (req, res) => {
  try {
    // Ambil user dengan role COMMUNITY
    const communityUsers = await prisma.user.findMany({
      where: {
        role: "COMMUNITY",
      },
    });

    // Ambil semua community yang nama nya ada di daftar user
    const communities = await prisma.community.findMany({
      where: {
        name: {
          in: communityUsers.map((user) => user.name),
        },
      },
    });

    // Simple mapping
    const result = communityUsers.map((user) => {
      const community = communities.find((c) => c.name === user.name);

      return {
        ...user,
        ...community
      };
    });

    res.status(200).json(result);
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

exports.getHistoryLogin = async (req, res) => {
  try {
    const history = await prisma.loginHistory.findMany({
      orderBy: { loginAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data login history",
      error: err.message,
    });
  }
};

exports.applyEvent = async (req, res) => {
  const { userId, communityId, title } = req.body;

  if (!userId || !communityId || !title) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    // Cek apakah sudah ada pengajuan yang sama
    const existing = await prisma.applyEvent.findFirst({
      where: {
        userId: parseInt(userId),
        communityId: parseInt(communityId),
        title: title,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Pengajuan event ini sudah ada" });
    }

    // Simpan ke tabel apply_event
    const newApply = await prisma.applyEvent.create({
      data: {
        userId: parseInt(userId),
        communityId: parseInt(communityId),
        title,
      },
    });

    res
      .status(201)
      .json({ message: "Pengajuan event berhasil", data: newApply });
  } catch (error) {
    console.error("Error apply event:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

exports.getAppliedEvents = async (req, res) => {
  try {
    const appliedEvents = await prisma.applyEvent.findMany({
      include: {
        user: true,
        community: true, // ambil info komunitas
      },
      orderBy: {
        appliedAt: "desc",
      },
    });
    res.status(200).json(appliedEvents);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data applied events",
      error: error.message,
    });
  }
};

exports.deleteAppliedEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await prisma.applyEvent.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Pendaftaran berhasil dihapus",
      deletedEvent,
    });
  } catch (error) {
    console.error("Gagal menghapus pendaftaran:", error);
    res.status(500).json({
      message: "Gagal menghapus pendaftaran",
      error: error.message,
    });
  }
};
