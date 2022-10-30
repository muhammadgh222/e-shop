const express = require("express");
const {
  signup,
  login,
  bla,
  protect,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updatePassword/").patch(protect, updatePassword);
router.route("/bla").get(protect, bla);

module.exports = router;
