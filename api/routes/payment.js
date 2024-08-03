import express from "express";
import {
  createPaymentIntent,
  createPaymentSheet,
} from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/create-intent", createPaymentIntent);
router.post("/create-sheet", createPaymentSheet);

export default router;
