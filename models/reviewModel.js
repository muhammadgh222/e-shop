const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  review: {
    type: String,
    required: [true, "Review can not be empty!"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        ratingsAvg: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        ratingsAvg: Math.ceil(result[0]?.ratingsAvg || 0),
        ratingsQuantity: result[0]?.ratingsQuantity || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
