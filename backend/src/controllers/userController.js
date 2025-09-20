const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil user terlebih dahulu untuk cek role
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Jika role MEMBER, return user biasa
    if (user.role === "MEMBER") {
      res.status(200).json(user);
      return;
    }

    // Jika role COMMUNITY, join dengan tabel communities
    if (user.role === "COMMUNITY") {
      const community = await prisma.community.findFirst({
        where: {
          name: user.name,
        },
      });

      // Gabungkan data user dan community
      const result = {
        ...user,
        ...community
      };

      res.status(200).json(result);
      return;
    }

    // Jika role lainnya, return user biasa
    res.status(200).json(user);

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        role,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
