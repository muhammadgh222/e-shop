const Product = require("../models/productModel");
const AsyncHandler = require("../utils/AsyncHandler");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${Math.random()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Plase provide valid image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const imgUpload = upload.single("image");
const getTopProducts = AsyncHandler(async (req, res, next) => {
  req.query.limit = "1";
  req.query.sort = "-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,description";
  next();
});
const createProduct = AsyncHandler(async (req, res) => {
  req.body.image = req.file.filename;
  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    product,
  });
});

const getAllProducts = AsyncHandler(async (req, res) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;
  res.status(200).json({
    status: "success",
    products,
  });
});

const getProduct = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("There is no such product", 404));
  }
  res.status(200).json({
    status: "success",
    product,
  });
});

const updateProduct = AsyncHandler(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    return next(new AppError("There is no such product", 404));
  }

  res.status(200).json({
    status: "success",
    updatedProduct,
  });
});

const deleteProduct = AsyncHandler(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return next(new AppError("There is no such product", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  imgUpload,
};
