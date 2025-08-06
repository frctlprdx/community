const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post("/post", eventController.createEvent); // Post Event (Community)
router.get("/get", eventController.getAllEvents); //Get All Event (Member)
router.get("/get/:id", eventController.getCommunityEvent) //Get Event Each Community (Member)
router.delete("/delete/:id", eventController.deleteEvent); //Delete Event (Coummunity)
router.put("/update/:id", eventController.updateEvent); //Update Event (Coummunity)

module.exports = router;