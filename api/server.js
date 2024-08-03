dotenv.config();
import bodyParser from "body-parser";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import PaymentRoute from "./routes/payment.js";
const app = express();

//server run in this port 8070
const PORT = 8070;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("Server Online");
});

app.use("/payment", PaymentRoute);

app.listen(PORT, () => {
  console.log(
    chalk.blue.bold("[Server]") +
      chalk.white.bold(" : Node server is running on port ") +
      chalk.green.bold(PORT)
  );
});
