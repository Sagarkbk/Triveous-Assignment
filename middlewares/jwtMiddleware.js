require("dotenv").config();

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ message: "Authorization Required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, JWT_SECRET);

    const existingUser = await prisma.user.findUnique({
      where: {
        id: decode.userId,
        email: decode.email,
      },
    });

    if (!existingUser) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.userId = decode.userId;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server Issue" });
  }
}

module.exports = jwtMiddleware;
