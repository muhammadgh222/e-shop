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

const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, imgUpload, createProduct).get(getAllProducts);
router.route("/top-rated").get(getTopProducts, getAllProducts);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
