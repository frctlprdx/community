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
