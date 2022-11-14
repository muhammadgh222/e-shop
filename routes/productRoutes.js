const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  imgUpload,
} = require("../controllers/productController");

const { protect, restrictTo } = require("../controllers/authController");
const { getProductReviews } = require("../controllers/productController");

const router = express.Router();

router
  .route("/")
  .post(protect, restrictTo("admin"), imgUpload, createProduct)
  .get(getAllProducts);
router.route("/top-rated").get(getTopProducts, getAllProducts);

router
  .route("/:id")
  .get(getProduct)
  .patch(protect, restrictTo("admin"), updateProduct)
  .delete(protect, restrictTo("admin"), deleteProduct);
router.route("/:id/reviews").get(protect, getProductReviews);

module.exports = router;
