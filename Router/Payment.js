import express from "express";
import { checkStatus, newPayment } from "../Controller/Payment.js";
const router = express.Router();

router.post("/payment", newPayment).post("/status/:txnId", checkStatus);

export default router;
