const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");

router.post("/create", communityController.createCommunity); //Register Community (Member)
router.get("/get", communityController.getAllCommunities); //List community (Admin)
router.get("/get/:id", communityController.communityMember); //List Member (Community)
router.delete("/member/:id", communityController.deleteMember); //Delete Member (Community)
router.post("/join", communityController.joinCommunity); //Join Community (Member)
router.delete("/delete/:id", communityController.deleteCommunity); //Delete Community (Admin)
router.put("/update/:id", communityController.updateCommunity);
router.get("/gethistory", communityController.getHistoryLogin);
router.post("/applyevent", communityController.applyEvent);
router.get("/applied-events", communityController.getAppliedEvents);
router.delete("/applied-events/:id", communityController.deleteAppliedEvent);

module.exports = router;
