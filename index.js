const express = require("express");

const cors = require("cors");

const app = express();

const addSeedData = require("./seedData");

addSeedData();

const loginRouter = require("./routes/login");

const signUpRouter = require("./routes/signUp");

app.use(cors());

app.use("/login", loginRouter);

app.use("/signUp", signUpRouter);

app.listen(3000);
