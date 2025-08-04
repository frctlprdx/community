const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post("/create", communityController.createCommunity);
router.get("/get", communityController.getAllCommunities);
router.post("/join", communityController.joinCommunity);
router.delete("/delete/:id", communityController.deleteCommunity);
router.put("/update/:id", communityController.updateCommunity);

module.exports = router;