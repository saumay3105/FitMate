const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/:email", userController.getUser);
router.put("/:email", userController.updateUser);

module.exports = router;
