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
        // Include participant count
        _count: {
          select: {
            eventParticipants: true,
          },
        },
      },
    });

    // Format events with participant count
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      createdById: event.createdById,
      communityName: event.createdBy?.name || null,
      participantCount: event._count.eventParticipants,
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
    const {
      title,
      description,
      date,
      imageUrl,
      location,
      price,
      maxParticipants,
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description, date, and location are required",
      });
    }

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      date: new Date(date),
      imageUrl,
      location,
      price: parseFloat(price) || 0,
      maxParticipants:
        maxParticipants === "" || maxParticipants === null
          ? null
          : parseInt(maxParticipants),
    };

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);

    // Handle Prisma errors
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Event with this title already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getCommunityEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await prisma.event.findMany({
      where: {
        createdById: Number(id),
      },
      include: {
        _count: {
          select: {
            eventParticipants: true,
          },
        },
      },
    });

    // Add participant count to each event
    const formattedEvents = events.map((event) => ({
      ...event,
      participantCount: event._count.eventParticipants,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("Error getting events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "ID event tidak valid",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            eventParticipants: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan",
      });
    }

    // Format event with additional data
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      createdById: event.createdById,
      organizerName: event.createdBy?.name || null,
      participantCount: event._count.eventParticipants,
      // Add other fields that might be in your schema
      location: event.location || null,
      price: event.price || 0,
      maxParticipants: event.maxParticipants || null,
    };

    res.status(200).json(formattedEvent);
  } catch (error) {
    console.error("Error get event by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Updated join event with better error handling
exports.joinCommunityEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Validate input
    if (!eventId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Event ID dan User ID harus disediakan",
      });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: {
        _count: {
          select: {
            eventParticipants: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Check if user is already registered
    const existingParticipant = await prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: {
          eventId: parseInt(eventId),
          userId: parseInt(userId),
        },
      },
    });

    if (existingParticipant) {
      return res.status(409).json({
        success: false,
        message: "Anda sudah terdaftar di event ini",
        isRegistered: true,
      });
    }

    // Check if event is full (if maxParticipants is set)
    if (
      event.maxParticipants &&
      event._count.eventParticipants >= event.maxParticipants
    ) {
      return res.status(400).json({
        success: false,
        message: "Event sudah penuh",
      });
    }

    // Create new participant
    const participant = await prisma.eventParticipant.create({
      data: {
        eventId: parseInt(eventId),
        userId: parseInt(userId),
      },
    });

    res.status(201).json({
      success: true,
      message: "Berhasil mendaftar event",
      participant,
      isRegistered: true,
    });
  } catch (error) {
    console.error("Error join event:", error);

    // Handle Prisma unique constraint violation
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Anda sudah terdaftar di event ini",
        isRegistered: true,
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mendaftar event",
    });
  }
};

// Updated check registration endpoint to match frontend expectations
exports.checkRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    // Validate parameters
    if (
      !eventId ||
      !userId ||
      isNaN(parseInt(eventId)) ||
      isNaN(parseInt(userId))
    ) {
      return res.status(400).json({
        success: false,
        message: "Event ID dan User ID harus berupa angka yang valid",
      });
    }

    const existingParticipant = await prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: {
          eventId: parseInt(eventId),
          userId: parseInt(userId),
        },
      },
    });

    res.json({
      success: true,
      isRegistered: !!existingParticipant,
    });
  } catch (error) {
    console.error("Error checking registration:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengecek status registrasi",
    });
  }
};

// Keep the old endpoint for backward compatibility
exports.checkUserJoinEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = Number(req.query.userId);

    const existing = await prisma.eventParticipant.findFirst({
      where: { eventId, userId },
    });

    res.json({ isJoined: !!existing });
  } catch (error) {
    console.error("Error check event:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat cek event" });
  }
};

exports.getParticipants = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        status: "error",
        message: "ID event tidak valid",
      });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event tidak ditemukan",
      });
    }

    // Get participants
    const participants = await prisma.eventParticipant.findMany({
      where: { eventId: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    if (!participants || participants.length === 0) {
      return res.status(200).json({
        status: "success",
        eventId: parseInt(id),
        participants: [],
        message: "Belum ada peserta untuk event ini",
      });
    }

    // Format participants
    const formatted = participants.map((p) => ({
      id: p.user.id,
      name: p.user.name,
      email: p.user.email,
      profilePicture: p.user.profilePicture,
      joinedAt: p.joinedAt,
    }));

    res.status(200).json({
      status: "success",
      eventId: parseInt(id),
      participants: formatted,
      totalParticipants: formatted.length,
    });
  } catch (error) {
    console.error("Gagal ambil peserta:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil peserta",
    });
  }
};
