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
      return res.status(409).json({ message: "Email already taken" });
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

    res.status(201).json({ message: "User created", token });
  } catch (error) {
    res.status(500).json(error);
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
      return res.json({ message: "Account not found" });
    }

    const userId = existingUser.id;
    const userEmail = existingUser.email;

    const token = generateJwtToken(userId, userEmail);

    res.json({ message: "Logged In", token });
  } catch (error) {
    res.json(error);
  }
});

const populateDBRouter = require("./populateDB");

userRouter.use("/populateDB", populateDBRouter);

const cartRouter = require("./cart");

userRouter.use("/cart", cartRouter);

const orderRouter = require("./order");

userRouter.use("/order", orderRouter);

module.exports = userRouter;
