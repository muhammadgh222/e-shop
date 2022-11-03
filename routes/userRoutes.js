const express = require("express");
const { protect } = require("../controllers/authController");
const { updateMe } = require("../controllers/userController");

const router = express.Router();

router.patch("/updateMe", protect, updateMe);

module.exports = router;
