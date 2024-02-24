const express = require("express");

const cors = require("cors");

const rateLimit = require("express-rate-limit");

const app = express();

const userRouter = require("./routes/user");

const categoryRouter = require("./routes/category");

const productRouter = require("./routes/product");

const populateDBRouter = require("./routes/populateDB");

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.use(cors());

app.use("/user", userRouter);

app.use("/store/category", categoryRouter);

app.use("/store/product", productRouter);

app.listen(3000);
