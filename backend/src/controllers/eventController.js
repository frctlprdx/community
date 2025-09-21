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
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Flatten biar tidak ada object "createdBy"
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      createdById: event.createdById,
      communityName: event.createdBy?.name || null,
    }));

    res.status(200).json(formattedEvents);
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

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error get event by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
