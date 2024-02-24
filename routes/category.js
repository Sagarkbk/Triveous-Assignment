const express = require("express");

const categoryRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

categoryRouter.use(express.json());

categoryRouter.get("/list", async (req, res) => {
  const categoryList = await prisma.category.findMany();

  const categories = categoryList.map((category) => category.name);

  res.json(categories);
});

module.exports = categoryRouter;
