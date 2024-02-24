const express = require("express");

const orderRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

orderRouter.use(express.json());

const jwtMiddleware = require("../middlewares/jwtMiddleware");

orderRouter.use(jwtMiddleware);

orderRouter.post("/buy", async (req, res) => {
  const itemId = parseInt(req.query.itemId);
  const userId = req.userId;

  try {
    const inTheCart = await prisma.cart.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!inTheCart) {
      return res.json("Product not in the Cart");
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

    await prisma.$transaction([
      prisma.order.create({
        data: { userId, totalPrice, products: { connect: { id: product.id } } },
      }),
      prisma.cart.delete({ where: { id: itemId } }),
    ]);
    res.json("Yay, you bought the product!");
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

orderRouter.get("/view", async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await prisma.order.findMany({
      include: { products: true },
    });

    if (!orders.length) {
      return res.send("No Orders");
    }

    res.json(orders);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

orderRouter.get("/history", async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await prisma.order.findMany({
      include: { products: true },
    });

    if (!orders.length) {
      return res.send("No Orders");
    }

    const history = [];

    for (let order of orders) {
      history.push({ Product: order.products[0].name, Time: order.createdAt });
    }

    res.json({ history });
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

module.exports = orderRouter;
