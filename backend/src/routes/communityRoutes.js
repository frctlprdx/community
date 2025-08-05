const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post("/create", communityController.createCommunity); //Register Community (Member)
router.get("/get", communityController.getAllCommunities); //List community (Admin)
router.get("/get/:id", communityController.communityMember) //List Member (Community)
router.delete("/member/:id", communityController.deleteMember); //Delete Member (Community)
router.post("/join", communityController.joinCommunity);//Join Community (Member)
router.delete("/delete/:id", communityController.deleteCommunity);//Delete Community (Admin)
router.put("/update/:id", communityController.updateCommunity);

module.exports = router;