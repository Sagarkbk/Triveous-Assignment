const categories = [
  {
    name: "Electronics",
    description: "",
    products: [
      {
        name: "Canon EOS R5 Full-Frame Mirrorless Camera",
        description:
          "8K Video, 45 Megapixel Full-Frame CMOS Sensor, DIGIC X Image Processor, Dual Memory Card Slots, and Up to 12 fps Mechnical Shutter, Body Only",
        price: 47999.0,
        image: "",
        quantity: 40,
      },
      {
        name: "Samsung Galaxy S24 Ultra 5G AI Smartphone",
        description: "Titanium Gray, 12GB, 512GB Storage",
        price: 129930.0,
        image: "",
        quantity: 10,
      },
      {
        name: "Apple 2023 MacBook Pro",
        description:
          "14-inch, M3 chip with 8‑core CPU and 10‑core GPU, 8GB Unified Memory, 1TB",
        price: 189900.0,
        image: "",
        quantity: 27,
      },
      {
        name: "Google Pixel Watch",
        description:
          "Android Smartwatch with Fitbit Activity Tracking - Heart Rate Tracking",
        price: 24850.0,
        image: "",
        quantity: 30,
      },
      {
        name: "Samsung Smart TV",
        description: "247 cm (98 Inches) 4K Ultra HD Smart Neo-QLED TV",
        price: 1549000.0,
        image: "",
        quantity: 10,
      },
    ],
  },
  {
    name: "Men's Clothing",
    description: "",
    products: [
      {
        name: "Shirts",
        description: "Men's Formal Shirts",
        price: 1500.0,
        image: "",
        quantity: 40,
      },
      {
        name: "Pants",
        description: "Men's Formal Pants",
        price: 999.0,
        image: "",
        quantity: 10,
      },
      {
        name: "Shorts",
        description: "Daily ware shorts",
        price: 666.0,
        image: "",
        quantity: 27,
      },
      {
        name: "t-Shirts",
        description: "Casual T-Shirts",
        price: 999.0,
        image: "",
        quantity: 30,
      },
      {
        name: "Suits",
        description: "Men's Two Piece Suits",
        price: 9999.0,
        image: "",
        quantity: 10,
      },
    ],
  },
  {
    name: "Books",
    description: "",
    products: [
      {
        name: "Harry Potter",
        description: "Harry Potter Books Set: The Complete Collection",
        price: 19999.0,
        image: "",
        quantity: 8,
      },
      {
        name: "Game of Thrones",
        description:
          "George R. R. Martin's A Game of Thrones Leather-Cloth Boxed Set (Song of Ice and Fire Series): A Game of Thrones, A Clash of Kings, A Storm of Swords, ... A Dance with Dragons (A Song of Ice and Fire)",
        price: 18888.0,
        image: "",
        quantity: 10,
      },
      {
        name: "Lord of the Rings",
        description:
          "The Hobbit & The Lord of the Rings Boxed Set: The Classic Bestselling Fantasy Novel",
        price: 15555.0,
        image: "",
        quantity: 27,
      },
    ],
  },
  {
    name: "Home Appliances",
    description: "",
    products: [
      {
        name: "LG Washing Machine",
        description:
          "LG WashTower 13 Kg /10 Kg with AI Direct Drive & DUAL Inverter Heat Pump, Fully Automatic Front-Loading Washing Machine and Dryer with Wi-Fi & Central Control Panel",
        price: 199999.0,
        image: "",
        quantity: 40,
      },
      {
        name: "Havells Hair Dryer",
        description:
          "1200 Watts Foldable Hair Dryer; 3 Heat (Hot/Cool/Warm) Settings including Cool Shot button; Heat Balance Technology",
        price: 1500.0,
        image: "",
        quantity: 80,
      },
      {
        name: "Crompton Geyser",
        description:
          "14-inch, M3 chip with 8‑core CPU and 10‑core GPU, 8GB Unified Memory, 1TB",
        price: 6298.0,
        image: "",
        quantity: 27,
      },
      {
        name: "Mitsubishi Air Conditioner",
        description:
          "Mitsubishi Heavy 2.0 Ton Inverter Split Hi-Wall Air Conditioner 5 STAR ",
        price: 105000.0,
        image: "",
        quantity: 30,
      },
      {
        name: "Whirlpool Refrigerator",
        description: "Whirlpool 240 L Frost Free Triple-Door Refrigerator",
        price: 25990.0,
        image: "",
        quantity: 39,
      },
    ],
  },
  {
    name: "FootWear",
    description: "",
    products: [
      {
        name: "Crocs",
        description: "Mens Literide Shoe Sneaker",
        price: 6295.0,
        image: "",
        quantity: 400,
      },
      {
        name: "Nike",
        description: "Mens Legend 9 Elite Fg Running Shoe",
        price: 20995.0,
        image: "",
        quantity: 30,
      },
      {
        name: "Adidas",
        description: "Mens Ultraboost 22Running Shoe",
        price: 14062.0,
        image: "",
        quantity: 27,
      },
      {
        name: "Mephisto",
        description: "Men's Shark Sandals, Chestnut Waxy/Tan Grain",
        price: 52919.0,
        image: "",
        quantity: 44,
      },
      {
        name: "Proenza Schouler",
        description: "Women's OE2008 Wedge Sandal",
        price: 106979.0,
        image: "",
        quantity: 10,
      },
    ],
  },
];

const express = require("express");

const populateDBRouter = express.Router();

const jwtMiddleware = require("../middlewares/jwtMiddleware");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

populateDBRouter.use(jwtMiddleware);

populateDBRouter.post("/", async (req, res) => {
  try {
    for (const categoryData of categories) {
      const { name, description, products } = categoryData;

      const createdCategory = await prisma.category.create({
        data: {
          name,
          description,
          products: {
            createMany: {
              data: products,
            },
          },
        },
        include: {
          products: true,
        },
      });
    }
    res.status(200).json({ message: "Database Populated !", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Issue", success: false });
  }
});

module.exports = populateDBRouter;
