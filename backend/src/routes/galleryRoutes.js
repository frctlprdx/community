const express = require('express');
const router = express.Router();
const postController = require('../controllers/galleryController');

router.post("/post", postController.createPost);

module.exports = router;