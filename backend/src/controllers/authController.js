const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { name, email, phone_number, password } = req.body;

  try {
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

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone_number,
        role: "MEMBER", // default
      },
    });
    res
      .status(201)
      .json({ message: "User berhasil didaftarkan", user: newUser });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mendaftar",
      error: err.message,
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

    // Simpan login history
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        loginAt: new Date(),
      },
    });

    // Jika sukses, kirim info user
    res.status(200).json({ message: "Login berhasil", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat login", error: err.message });
  }
};
