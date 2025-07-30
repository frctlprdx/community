const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createCommunity = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const newCommunity = await prisma.community.create({
      data: {
        name,
      },
    });
    res.status(201).json({
      message: "new community created successfully",
      data: newCommunity,
    });
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
