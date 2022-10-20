const express = require("express");
const AppError = require("./utils/AppError");
const AsyncHandler = require("./utils/AsyncHandler");
const ErrorHandler = require("./utils/ErrorHandler");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.all("*", (req, res, next) => {
  return next(new AppError("There is no such page", 404));
});

app.use(ErrorHandler);

module.exports = app;
