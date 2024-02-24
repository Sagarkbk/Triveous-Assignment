const express = require("express");

const cartRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

cartRouter.use(express.json());

const jwtMiddleware = require("../middlewares/jwtMiddleware");

cartRouter.use(jwtMiddleware);

cartRouter.post("/add", async (req, res) => {
  const productId = parseInt(req.query.productId);
  const quantity = parseInt(req.query.quantity);
  const userId = req.userId;

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) {
      return res.json("Product doesn't exist");
    }

    if (!product.quantity || product.quantity < quantity) {
      return res.json("Product Sold Out (OR) Less In Stock");
    }

    const productAlreadyInCart = await prisma.cart.findFirst({
      where: {
        productId,
      },
    });

    if (productAlreadyInCart) {
      const newQuantity = productAlreadyInCart.quantity + quantity;
      await prisma.cart.update({
        data: {
          quantity: newQuantity,
        },
        where: {
          id: productAlreadyInCart.id,
        },
      });
      return res.json("Added to Cart!");
    }

    const addToCart = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
    res.json("Added to Cart!");
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

cartRouter.delete("/remove", async (req, res) => {
  const itemId = parseInt(req.query.itemId);
  const userId = req.userId;

  try {
    const inTheCart = await prisma.cart.findFirst({
      where: {
        id: itemId,
      },
    });

    if (!inTheCart) {
      return res.json("Product is not in Cart. So cannot be removed");
    }

    await prisma.cart.delete({
      where: {
        id: itemId,
      },
    });
    res.json("Product removed from your Cart!");
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

cartRouter.get("/view", async (req, res) => {
  const userId = req.userId;
  try {
    const cartItems = await prisma.cart.findMany();
    if (!cartItems.length) {
      return res.json("Cart is Empty");
    }
    res.json(cartItems);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

cartRouter.put("/update", async (req, res) => {
  const itemId = parseInt(req.query.itemId);
  const newQuantity = parseInt(req.query.quantity);
  const userId = req.userId;

  try {
    const inTheCart = await prisma.cart.findFirst({
      where: {
        id: itemId,
      },
    });
    if (!inTheCart) {
      return res.json("Product is not in the Cart");
    }
    await prisma.cart.update({
      data: {
        quantity: newQuantity,
      },
      where: {
        id: itemId,
      },
    });
    res.json("Updated!");
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

module.exports = cartRouter;
