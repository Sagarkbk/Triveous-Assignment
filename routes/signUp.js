const express = require("express");

const signUpRouter = express.Router();

const inputValidation = require("../middlewares/inputValidation");

const generateJwtToken = require("../middlewares/generateJwtToken");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

signUpRouter.use(express.json());

signUpRouter.use(inputValidation);

signUpRouter.post("/", async (req, res) => {
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

module.exports = signUpRouter;
