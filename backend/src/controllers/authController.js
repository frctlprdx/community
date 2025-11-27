// src/controllers/authController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

/**
 * Helper: sanitize & normalize string (trim + empty -> null)
 */
function cleanString(value) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v === "" ? null : v;
}

/**
 * Register member (normal user)
 */
exports.registermember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone_number,
      password,
      bio,
      profilePictureUrl,
    } = req.body;

    // Basic required validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // Normalize inputs
    const cleanedName = name.trim();
    const cleanedEmail = email.toLowerCase().trim();
    const cleanedPhone = cleanString(phone_number);
    const cleanedBio = cleanString(bio);
    const cleanedProfilePicture = cleanString(profilePictureUrl);

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    // Password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    // Phone validation (optional)
    if (cleanedPhone && !/^[0-9+\-\s()]+$/.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Format nomor telepon tidak valid",
      });
    }

    // profilePictureUrl validation (if provided)
    if (cleanedProfilePicture) {
      try {
        const url = new URL(cleanedProfilePicture);
        // optional domain check (comment out or adjust if you accept other hosts)
        if (!url.href.includes("community-diskominfo")) {
          return res.status(400).json({
            success: false,
            message: "URL gambar tidak berasal dari sumber yang diizinkan",
          });
        }
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Format URL gambar tidak valid",
        });
      }
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanedEmail },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: cleanedName,
        email: cleanedEmail,
        passwordHash,
        phone_number: cleanedPhone,
        role: "MEMBER",
        bio: cleanedBio,
        profilePicture: cleanedProfilePicture,
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

    console.log(`New member registered: ${newUser.email}`);

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: { user: newUser },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Prisma unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Data sudah ada (kemungkinan email terdaftar)",
      });
    }

    if (error.code === "P1001") {
      return res.status(503).json({
        success: false,
        message: "Layanan database sedang tidak tersedia",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * Register community (creates user with role COMMUNITY + community + membership)
 */
exports.registercommunity = async (req, res) => {
  try {
    const {
      name,
      email,
      phone_number,
      password,
      bio,
      profilePictureUrl,
      category,
      socialLink,
    } = req.body;

    // Required validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // Normalize
    const cleanedName = name.trim();
    const cleanedEmail = email.toLowerCase().trim();
    const cleanedPhone = cleanString(phone_number);
    const cleanedBio = cleanString(bio);
    const cleanedProfilePicture = cleanString(profilePictureUrl);
    const cleanedCategory = cleanString(category);
    const cleanedSocialLink = cleanString(socialLink);

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    // Password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    // socialLink validation
    if (cleanedSocialLink && !/^https?:\/\//i.test(cleanedSocialLink)) {
      return res.status(400).json({
        success: false,
        message: "Link sosial harus dimulai dengan http:// atau https://",
      });
    }

    // profilePictureUrl validation
    if (cleanedProfilePicture) {
      try {
        const url = new URL(cleanedProfilePicture);
        if (!url.href.includes("community-diskominfo")) {
          return res.status(400).json({
            success: false,
            message: "URL gambar tidak berasal dari sumber yang diizinkan",
          });
        }
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Format URL gambar tidak valid",
        });
      }
    }

    // Check existing email and community name (use trimmed/lowercase where appropriate)
    const [existingUser, existingCommunity] = await Promise.all([
      prisma.user.findUnique({ where: { email: cleanedEmail } }),
      prisma.community.findFirst({ where: { name: cleanedName } }),
    ]);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }
    if (existingCommunity) {
      return res.status(400).json({
        success: false,
        message: "Nama komunitas sudah digunakan",
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Use transaction with `tx` param (don't shadow global prisma)
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: cleanedName,
          email: cleanedEmail,
          phone_number: cleanedPhone,
          passwordHash,
          role: "COMMUNITY",
          bio: cleanedBio,
          profilePicture: cleanedProfilePicture,
        },
      });

      const newCommunity = await tx.community.create({
        data: {
          name: cleanedName,
          category: cleanedCategory,
          socialLink: cleanedSocialLink,
          memberCount: 1,
        },
      });

      await tx.communityMember.create({
        data: {
          userId: newUser.id,
          communityId: newCommunity.id,
          role: "MEMBER", // keep as MEMBER or change to "ADMIN" if you prefer
        },
      });

      return { user: newUser, community: newCommunity };
    });

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = result.user;

    return res.status(201).json({
      success: true,
      message: "Komunitas berhasil didaftarkan",
      data: {
        user: userWithoutPassword,
        community: result.community,
      },
    });
  } catch (error) {
    console.error("Error registering community:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Data sudah ada (email atau nama komunitas duplikat)",
      });
    }
    if (error.code === "P1001") {
      return res.status(503).json({
        success: false,
        message: "Layanan database sedang tidak tersedia",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanedEmail = email?.toLowerCase().trim();

    if (!cleanedEmail || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({ where: { email: cleanedEmail } });
    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Save login history for MEMBER or COMMUNITY
    if (user.role === "MEMBER" || user.role === "COMMUNITY") {
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          loginAt: new Date(),
        },
      });
    }

    // Don't expose passwordHash
    const { passwordHash: _, ...userSafe } = user;

    return res.status(200).json({ message: "Login berhasil", user: userSafe });
  } catch (err) {
    console.error("Login error:", err);

    if (err.code === "P1001") {
      return res.status(503).json({
        message: "Database tidak tersedia. Silakan coba lagi nanti.",
      });
    }

    return res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
};
