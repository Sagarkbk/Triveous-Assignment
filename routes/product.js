const express = require("express");

const productRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

productRouter.use(express.json());

productRouter.get("/searchCategory", async (req, res) => {
  const categoryId = parseInt(req.query.categoryId);
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
      },
    });

    products.length
      ? res.json(products)
      : res.json("No Products under given Category Id");
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

productRouter.get("/searchProduct", async (req, res) => {
  const id = parseInt(req.query.productId);
  try {
    const products = await prisma.product.findMany({
      where: {
        id,
      },
    });

    products.length
      ? res.json(products)
      : res.json("No Products under given Category Id");
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

module.exports = productRouter;
