const express = require("express");

const orderRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

orderRouter.use(express.json());

const jwtMiddleware = require("../middlewares/jwtMiddleware");

orderRouter.use(jwtMiddleware);

orderRouter.post("/buy/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const userId = req.userId;

  try {
    const inTheCart = await prisma.cart.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!inTheCart) {
      return res
        .status(404)
        .json({ message: "Product not in the Cart", success: true });
    }

    const productId = inTheCart.productId;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    const price = product.price;
    const quantity = inTheCart.quantity;
    const totalPrice = quantity * price;

    const bought = await prisma.$transaction([
      prisma.order.create({
        data: { userId, totalPrice },
      }),
    ]);
    await prisma.cart.delete({ where: { id: itemId } }),
      res.status(200).json({
        message: "Yay, you bought the product!",
        bought,
        success: true,
      });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
    // console.log(err);
  }
});

orderRouter.get("/view", async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await prisma.order.findMany({
      include: { products: true },
    });

    if (!orders.length) {
      return res
        .status(200)
        .json({ message: "You haven't bought any product yet", success: true });
    }

    res.status(200).json({ orders, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
    // console.log(err);
  }
});

orderRouter.get("/history", async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await prisma.order.findMany({
      include: { products: true },
    });

    if (!orders.length) {
      return res
        .status(200)
        .json({ message: "You haven't bought any product yet", success: true });
    }

    const history = [];

    for (let order of orders) {
      history.push({
        id: order.id,
        Time: order.createdAt.toLocaleString(),
      });
    }

    res.status(200).json({ history, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
    // console.log(err);
  }
});

module.exports = orderRouter;
