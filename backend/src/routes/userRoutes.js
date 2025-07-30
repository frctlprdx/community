const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/getUsers", userController.getAllUsers);
router.get("/getUser/:id", userController.getUserById);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;