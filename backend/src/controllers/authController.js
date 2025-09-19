const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.registermember = async (req, res) => {
  try {
    const { name, email, phone_number, password, bio, profilePicture } =
      req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
        errors: {
          name: !name ? "Nama wajib diisi" : null,
          email: !email ? "Email wajib diisi" : null,
          password: !password ? "Password wajib diisi" : null,
        },
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
        errors: {
          email: "Format email tidak valid",
        },
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
        errors: {
          password: "Password minimal 8 karakter",
        },
      });
    }

    // Phone number validation (optional)
    if (phone_number && !/^[0-9+\-\s()]+$/.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: "Format nomor telepon tidak valid",
        errors: {
          phone_number: "Format nomor telepon tidak valid",
        },
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
        errors: {
          email: "Email sudah digunakan oleh pengguna lain",
        },
      });
    }

    // Hash password with higher salt rounds for better security
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user with proper data handling
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        phone_number: phone_number?.trim() || null,
        role: "MEMBER",
        bio: bio?.trim() || null,
        profilePicture: profilePicture || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        role: true,
        bio: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    // Success response
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Selamat bergabung dengan komunitas kami.",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      // Unique constraint violation
      const target = error.meta?.target;
      if (target?.includes("email")) {
        return res.status(400).json({
          success: false,
          message: "Email sudah terdaftar",
          errors: {
            email: "Email sudah digunakan oleh pengguna lain",
          },
        });
      }
    }

    // Handle validation errors
    if (error.code === "P2000") {
      return res.status(400).json({
        success: false,
        message: "Data yang diberikan tidak valid",
        errors: {
          general: "Periksa kembali data yang dimasukkan",
        },
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
      errors: {
        server: "Internal server error",
      },
    });
  }
};

exports.registercommunity = async (req, res) => {
  try {
    const { name, email, phone_number, password, bio, profilePicture } = req.body;

    // Validasi input yang required
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi'
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Validasi panjang password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 8 karakter'
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Cek apakah nama komunitas sudah ada
    const existingCommunity = await prisma.community.findFirst({
      where: { name: name }
    });

    if (existingCommunity) {
      return res.status(400).json({
        success: false,
        message: 'Nama komunitas sudah digunakan'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Mulai transaction untuk membuat user dan community sekaligus
    const result = await prisma.$transaction(async (prisma) => {
      // Buat user dengan role COMMUNITY
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          phone_number: phone_number || null,
          passwordHash: passwordHash,
          role: 'COMMUNITY',
          bio: bio || null,
          profilePicture: profilePicture || null
        }
      });

      // Buat community
      const newCommunity = await prisma.community.create({
        data: {
          name: name,
          category: null, // bisa ditambahkan nanti
          socialLink: null, // bisa ditambahkan nanti
          memberCount: 1,
        }
      });

      // Tambahkan owner sebagai member pertama komunitas
      await prisma.communityMember.create({
        data: {
          userId: newUser.id,
          communityId: newCommunity.id,
          role: 'MEMBER' // atau role khusus untuk owner
        }
      });

      return { user: newUser, community: newCommunity };
    });

    // Response sukses tanpa mengirim password hash
    const { passwordHash: _, ...userWithoutPassword } = result.user;

    res.status(201).json({
      success: true,
      message: 'Komunitas berhasil didaftarkan',
      data: {
        user: userWithoutPassword,
        community: result.community
      }
    });

  } catch (error) {
    console.error('Error registering community:', error);
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Data sudah ada (email atau nama komunitas duplikat)'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    // Bandingkan password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Cek role sebelum simpan login history
    if (user.role === "MEMBER") {
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          loginAt: new Date(),
        },
      });
    }

    // Jika sukses, kirim info user
    res.status(200).json({ message: "Login berhasil", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat login", error: err.message });
  }
};
