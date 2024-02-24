const express = require("express");

const userRouter = express.Router();

const inputValidation = require("../middlewares/inputValidation");

const generateJwtToken = require("../middlewares/generateJwtToken");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

userRouter.use(express.json());

userRouter.use(inputValidation);

userRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already taken", success: false });
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    const userId = newUser.id;
    const userEmail = newUser.email;

    const token = generateJwtToken(userId, userEmail);

    res.status(201).json({
      message: "Account Created Succesfully",
      success: true,
      "Authorization Token": token,
    });
  } catch (error) {
    res.status(500).json({ Error: "Server Issue", success: false });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Account not found", success: false });
    }

    const userId = existingUser.id;
    const userEmail = existingUser.email;

    const token = generateJwtToken(userId, userEmail);

    res.json({
      message: "You've Successfully Signed In",
      success: true,
      "Authorization Token": token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Issue", success: false });
  }
});

const populateDBRouter = require("./populateDB");

userRouter.use("/populateDB", populateDBRouter);

const cartRouter = require("./cart");

userRouter.use("/cart", cartRouter);

const orderRouter = require("./order");

userRouter.use("/order", orderRouter);

module.exports = userRouter;
