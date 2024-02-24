const express = require("express");

const categoryRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

categoryRouter.use(express.json());

categoryRouter.get("/list", async (req, res) => {
  try {
    const categoryList = await prisma.category.findMany();

    const categories = categoryList.map((category) => category.name);

    res.status(200).json({ categories, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
  }
});

module.exports = categoryRouter;
