const AsyncHandler = require("../utils/AsyncHandler");
const AppError = require("../utils/AppError");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = AsyncHandler(async (req, res, next) => {
  const { items, tax, shippingFee } = req.body;

  if (!items || items.length < 1) {
    return next(new AppError("You have no items in your cart", 400));
  }

  if (!tax || !shippingFee) {
    return next(new AppError("Please add tax and shipping fee", 400));
  }
  let orderItems = [];
  let subtotal = 0;

  for (let item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new AppError("There is no such product", 404));
    }

    const { name, price, _id, image } = product;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user._id,
  });

  res.status(201).json({ order, clientSecret: order.clientSecret });
});

const getAllOrders = AsyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.status(200).json({ status: "success", orders, count: orders.length });
});
const getOrder = AsyncHandler(async (req, res, next) => {
  console.log("ss");

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("There is no such order", 404));
  }
  res.status(200).json({ status: "success", order });
});

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({ status: "success", orders, count: orders.length });
};
const updateOrder = async (req, res) => {
  const { paymentIntentId } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("There is no such order", 404));
  }

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  console.log(paymentIntentId);
  res.status(200).json({ status: "success", order });
};

module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrder,
  getCurrentUserOrders,
};
