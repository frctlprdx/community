const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post("/post", eventController.createEvent);

module.exports = router;