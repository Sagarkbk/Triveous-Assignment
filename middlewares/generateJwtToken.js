require("dotenv").config();

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function generateJwtToken(userId, userEmail) {
  const token = jwt.sign({ userId, userEmail }, JWT_SECRET);

  return token;
}

module.exports = generateJwtToken;
