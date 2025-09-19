const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/registermember", authController.registermember);
router.post("/registercommunity", authController.registercommunity);
router.post("/login", authController.login);

module.exports = router;
