const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
  },
  category: {
    type: String,
    required: [true, "A product must have a category"],
    enum: ["clothes", "electronics", "toys"],
  },
  price: {
    type: String,
    required: [true, "A product must have a price"],
  },
  description: {
    type: String,
    required: [true, "A product must have a description"],
  },
  image: {
    type: String,
    default: "/uploads/example.jpeg",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  numInStock: {
    type: Number,
    default: 10,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
