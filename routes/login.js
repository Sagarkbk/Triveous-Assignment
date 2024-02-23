const express = require("express");

const loginRouter = express.Router();

const inputValidation = require("../middlewares/inputValidation");

const generateJwtToken = require("../middlewares/generateJwtToken");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

loginRouter.use(express.json());

loginRouter.use(inputValidation);

loginRouter.post("/", async (req, res) => {
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

module.exports = loginRouter;
