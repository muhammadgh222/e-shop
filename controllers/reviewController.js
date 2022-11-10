const AsyncHandler = require("../utils/AsyncHandler");
const AppError = require("../utils/AppError");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");

const createReview = AsyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;

  const { product: productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("There is no such product", 404));
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadySubmitted) {
    return next(new AppError("You already submitted the review", 400));
  }

  const review = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    review,
  });
});

const getAllReviews = AsyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name price",
    })
    .populate({
      path: "user",
      select: "name",
    });

  res.status(200).json({
    status: "success",
    reviews,
    count: reviews.length,
  });
});

const getReview = AsyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate({
      path: "product",
      select: "name price",
    })
    .populate({
      path: "user",
      select: "name",
    });

  if (!review) {
    return next(new AppError("There is no such review", 404));
  }

  res.status(200).json({
    status: "success",
    review,
  });
});

const updateReview = AsyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("There is no such review", 404));
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You're not authorized to update this review", 403)
    );
  }

  review.review = req.body.review;
  review.rating = req.body.rating;

  await review.save();
  res.status(200).json({
    status: "success",
    review,
  });
});

const deleteReview = AsyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("There is no such review", 404));
  }
  if (review.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You're not authorized to update this review", 403)
    );
  }

  await review.remove();
  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
};
