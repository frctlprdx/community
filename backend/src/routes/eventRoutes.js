const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Event CRUD operations
router.post("/post", eventController.createEvent); // Post Event (Community)
router.get("/get", eventController.getAllEvents); // Get All Events (Member)
router.get("/get/:id", eventController.getCommunityEvent); // Get Events by Community (Member)
router.get("/eventdetail/:id", eventController.getEventById); // Get Event Details
router.delete("/delete/:id", eventController.deleteEvent); // Delete Event (Community)
router.put("/update/:id", eventController.updateEvent); // Update Event (Community)

// Event participation
router.post("/join", eventController.joinCommunityEvent); // Join Event (Member)
router.get("/check-registration/:eventId/:userId", eventController.checkRegistration); // Check if user is registered
router.get("/check/:id", eventController.checkUserJoinEvent); // Legacy check endpoint (keep for backward compatibility)
router.get("/getparticipants/:id", eventController.getParticipants); // Get Event Participants

module.exports = router;