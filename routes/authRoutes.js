const express = require("express");
const {
  signup,
  login,
  bla,
  protect,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/bla").get(protect, bla);

module.exports = router;
