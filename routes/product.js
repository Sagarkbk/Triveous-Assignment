const express = require("express");

const productRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

productRouter.use(express.json());

productRouter.get("/searchCategory/:categoryId", async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
      },
    });

    products.length
      ? res.status(200).json({ products, success: true })
      : res.status(404).json({
          message: "No Products under given Category Id",
          success: false,
        });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Server Issue", success: false });
  }
});

productRouter.get("/searchProduct/:productId", async (req, res) => {
  const id = parseInt(req.params.productId);
  try {
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    product
      ? res.status(200).json({ product, success: true })
      : res.status(404).json({
          message: "There isn't any Product with that Id",
          success: false,
        });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Server Issue", success: false });
  }
});

module.exports = productRouter;
