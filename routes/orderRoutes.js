const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  getCurrentUserOrders,
} = require("../controllers/orderController");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .post(protect, createOrder)
  .get(protect, restrictTo("admin"), getAllOrders);
router.route("/showMyOrders").get(protect, getCurrentUserOrders);

router.route("/:id").get(protect, getOrder).patch(protect, updateOrder);

module.exports = router;
