const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post("/post", eventController.createEvent);
router.get("/get", eventController.getAllEvents);
router.delete("/delete/:id", eventController.deleteEvent);
router.put("/update/:id", eventController.updateEvent);

module.exports = router;