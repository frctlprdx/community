const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, imageUrl, createdById } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        imageUrl,
        createdById: createdById ? parseInt(createdById) : undefined,
      },
    });

    res.status(201).json({
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
