const express = require("express");

const cartRouter = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

cartRouter.use(express.json());

const jwtMiddleware = require("../middlewares/jwtMiddleware");

cartRouter.use(jwtMiddleware);

cartRouter.post("/add/:productId/:quantity", async (req, res) => {
  const productId = parseInt(req.params.productId);
  const quantity = parseInt(req.params.quantity);
  const userId = req.userId;

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product doesn't exist", success: false });
    }

    if (!product.quantity || product.quantity < quantity) {
      return res.status(404).json({
        message: "Product Sold Out (OR) Low in Stock",
        success: false,
      });
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
      return res.status(200).json({ message: "Added to Cart!", success: true });
    }

    const addToCart = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
    res.status(200).json({ message: "Added to Cart!", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
    // console.log(err);
  }
});

cartRouter.delete("/remove/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const userId = req.userId;

  try {
    const inTheCart = await prisma.cart.findFirst({
      where: {
        id: itemId,
      },
    });

    if (!inTheCart) {
      return res.status(404).json({
        message: "Product is not in Cart. So cannot be removed",
        success: false,
      });
    }

    await prisma.cart.delete({
      where: {
        id: itemId,
      },
    });
    res
      .status(200)
      .json({ message: "Product removed from your Cart!", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
    // console.log(err);
  }
});

cartRouter.get("/view", async (req, res) => {
  const userId = req.userId;
  try {
    const cartItems = await prisma.cart.findMany({
      include: {
        products: true,
      },
    });
    if (!cartItems.length) {
      return res.status(200).json({ message: "Cart is Empty", success: true });
    }
    res.status(200).json({ "Saved Products": cartItems, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
    // console.log(err);
  }
});

cartRouter.put("/update/:itemId/:quantity", async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const newQuantity = parseInt(req.params.quantity);
  const userId = req.userId;

  try {
    const inTheCart = await prisma.cart.findFirst({
      where: {
        id: itemId,
      },
    });
    if (!inTheCart) {
      return res
        .status(404)
        .json({ message: "Product is not in the Cart", success: false });
    }
    await prisma.cart.update({
      data: {
        quantity: newQuantity,
      },
      where: {
        id: itemId,
      },
    });
    res.status(200).json({ message: "Updated!", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Issue", success: false });
    // console.log(err);
  }
});

module.exports = cartRouter;
