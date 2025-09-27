const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.post("/post", galleryController.createPost);
router.get("/get", galleryController.getAllPosts);
router.get("/getCommunity/:id", galleryController.getCommunityGallery);
router.get("/get/:id", galleryController.getGalleryById);
router.get("/getdetail/:id", galleryController.getGalleryDetail)
router.delete("/delete/:id", galleryController.destroyPost);
router.put("/update/:id", galleryController.updatePost);

module.exports = router;