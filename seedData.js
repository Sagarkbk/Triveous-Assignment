categories = [
  {
    name: "Electronics",
    description: "Electronic devices and gadgets",
    products: [
      {
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        quantity: 100,
      },
      {
        name: "Smartphone",
        description: "Latest smartphone model",
        price: 799.99,
        quantity: 100,
      },
    ],
  },
  {
    name: "Clothing",
    description: "Clothing items and accessories",
    products: [
      {
        name: "T-shirt",
        description: "Cotton T-shirt",
        price: 19.99,
        quantity: 100,
      },
      {
        name: "Jeans",
        description: "Slim-fit jeans",
        price: 39.99,
        quantity: 100,
      },
    ],
  },
];

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addSeedData() {
  try {
    for (const categoryData of categories) {
      const { products, ...category } = categoryData;

      const createdCategory = await prisma.category.create({
        data: category,
      });

      const productsWithCategoryId = products.map((product) => ({
        ...product,
        categoryId: createdCategory.id,
      }));

      await prisma.product.createMany({
        data: productsWithCategoryId,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = addSeedData;
