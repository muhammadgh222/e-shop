const express = require("express");
const { protect } = require("../controllers/authController");
const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.route("/").post(protect, createReview).get(protect, getAllReviews);
router
  .route("/:id")
  .get(protect, getReview)
  .patch(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
