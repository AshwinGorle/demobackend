const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(cors());
const DB = mongoose
  .connect(
    process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)
  ).then(()=>console.log("db connected...."))
  .catch(() => console.log("Connection Failed"));

const userRouter = require("./../routes/userRoutes");
const bookRouter = require("./../routes/BookRoutes");
const issueRouter = require("./../routes/issueRoutes");
const issuedBookRouter = require("./../routes/issuedBookRoutes");
app.use("/api/v1/user", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/issueBook", issueRouter);
app.use("/api/v1/issuedBooks", issuedBookRouter);
app.get("/", (req, res, next) => {
  res.send("<h1>Hello</h1>");
  next();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`server sarted at ${process.env.PORT}`);
});
