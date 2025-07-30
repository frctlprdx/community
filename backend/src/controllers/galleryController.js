const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  try {
    const { title, imageUrl, communityId } = req.body;

    // Validasi input
    if (!title) {
      return res.status(400).json({ message: 'Title dan communityId wajib diisi.' });
    }

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        imageUrl,
        communityId: parseInt(communityId),
      },
    });

    res.status(201).json({
      message: 'Gallery post created successfully',
      data: newGallery,
    });
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

