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
        ...community,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.communityDetail = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Nama komunitas harus disediakan" });
    }

    const communityName = decodeURIComponent(name).trim();

    // Ambil user berdasarkan nama
    const user = await prisma.user.findFirst({
      where: {
        name: {
          equals: communityName,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Ambil community berdasarkan nama
    const community = await prisma.community.findFirst({
      where: {
        name: {
          equals: communityName,
        },
      },
    });

    if (!community) {
      return res.status(404).json({ message: "Community tidak ditemukan" });
    }

    // Gabungkan data user + community, exclude id & passwordHash
    const { id, passwordHash, ...userSafe } = user;
    const { ...communitySafe } = community;

    const result = {
      ...userSafe,
      ...communitySafe,
    };

    // Convert BigInt -> String supaya tidak error
    const safeResult = JSON.parse(
      JSON.stringify(result, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json(safeResult);
  } catch (error) {
    console.error("Error fetching community detail:", error);
    res
      .status(500)
      .json({ message: "Internal server error", detail: error.message });
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

    // Validasi input
    if (!userId || !communityId) {
      return res.status(400).json({
        success: false,
        message: "User ID dan Community ID harus diisi",
      });
    }

    // Konversi ke integer jika diperlukan
    const userIdInt = parseInt(userId);
    const communityIdInt = parseInt(communityId);

    if (isNaN(userIdInt) || isNaN(communityIdInt)) {
      return res.status(400).json({
        success: false,
        message: "User ID dan Community ID harus berupa angka yang valid",
      });
    }

    // Cek apakah user exists
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Cek apakah community exists
    const community = await prisma.community.findUnique({
      where: { id: communityIdInt },
    });

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Komunitas tidak ditemukan",
      });
    }

    // Cek apakah user sudah menjadi member
    const existingMember = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: userIdInt,
          communityId: communityIdInt,
        },
      },
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "Anda sudah menjadi member komunitas ini",
      });
    }

    // Menggunakan transaction untuk memastikan konsistensi data
    const result = await prisma.$transaction(async (prisma) => {
      // Tambah member baru
      const newMember = await prisma.communityMember.create({
        data: {
          userId: userIdInt,
          communityId: communityIdInt,
          role: "MEMBER",
        },
      });

      // Update member count
      const updatedCommunity = await prisma.community.update({
        where: { id: communityIdInt },
        data: {
          memberCount: {
            increment: 1,
          },
        },
      });

      return { newMember, updatedCommunity };
    });

    res.status(201).json({
      success: true,
      message: "Berhasil bergabung dengan komunitas",
      data: {
        membership: result.newMember,
        community: {
          id: result.updatedCommunity.id,
          name: result.updatedCommunity.name,
          memberCount: result.updatedCommunity.memberCount,
        },
      },
    });
  } catch (error) {
    console.error("Error joining community:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Anda sudah menjadi member komunitas ini",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User atau komunitas tidak ditemukan",
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller untuk mengecek membership status
exports.checkMembership = async (req, res) => {
  try {
    const { communityId, userId } = req.params;

    const userIdInt = parseInt(userId);
    const communityIdInt = parseInt(communityId);

    if (isNaN(userIdInt) || isNaN(communityIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or community ID",
      });
    }

    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: userIdInt,
          communityId: communityIdInt,
        },
      },
    });

    res.json({
      success: true,
      isMember: !!membership,
      membership: membership || null,
    });
  } catch (error) {
    console.error("Error checking membership:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal",
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
    // Ambil userId unik + waktu login terakhir
    const grouped = await prisma.loginHistory.groupBy({
      by: ["userId"],
      _max: {
        loginAt: true,
      },
      orderBy: {
        _max: {
          loginAt: "desc",
        },
      },
    });

    // Ambil detail user berdasarkan hasil groupBy
    const history = await Promise.all(
      grouped.map(async (g) => {
        const user = await prisma.user.findUnique({
          where: { id: g.userId },
          select: { id: true, name: true, email: true, role: true }, // ⬅️ tambahkan id di sini
        });

        return {
          id: user.id, // ⬅️ id ikut dikembalikan
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: g._max.loginAt,
        };
      })
    );

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data login history",
      error: err.message,
    });
  }
};

exports.getHistoryDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari user
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        loginHistories: {
          orderBy: { loginAt: "desc" },
          select: { id: true, loginAt: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(user);
  } catch (error) {
    console.error("Gagal ambil detail history:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
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
