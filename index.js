const express = require("express");

const app = express();

const loginRouter = require("./routes/login");

const signUpRouter = require("./routes/signUp");

app.use("/login", loginRouter);

app.use("/signUp", signUpRouter);

app.listen(3000);
