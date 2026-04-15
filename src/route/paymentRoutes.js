import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../controller/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/checkout-session", protect, createCheckoutSession);
paymentRouter.post("/webhook", stripeWebhook);

export default paymentRouter;
