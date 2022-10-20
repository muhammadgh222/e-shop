const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

const app = require("./app");

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;

// Database connection
const DBPasswrod = process.env.DB_PASSWORD;

const DB = process.env.MONGO_URI.replace("<PASSWORD>", DBPasswrod);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected successfully"));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
