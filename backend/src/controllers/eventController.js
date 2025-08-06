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

exports.getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error getting events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, imageUrl } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        date: new Date(date),
        imageUrl,
      },
    });

    res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCommunityEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await prisma.event.findMany({
      where: {
        createdById: Number(id), // pastikan tipe number
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error getting events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
