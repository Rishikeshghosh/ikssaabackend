import express from "express";
import dotenv from "dotenv";
import PaymentRouter from "./Router/Payment.js";
import cors from "cors";
const server = express();
dotenv.config();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT;

server.use("/iksaa/phonepe", PaymentRouter);

server.listen(PORT, () => {
  console.log(`${`Server is running at port ${PORT}`}`);
});
