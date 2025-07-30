const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.post("/post", galleryController.createPost);
router.get("/post/", galleryController.readPost);
router.delete("/post/:id", galleryController.destroyPost);
router.put("/post/:id", galleryController.updatePost);

module.exports = router;