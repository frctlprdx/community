const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post("/create", communityController.createCommunity);

module.exports = router;