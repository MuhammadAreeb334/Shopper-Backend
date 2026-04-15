import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controller/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/add", protect, addToCart);
cartRouter.post("/remove", protect, removeFromCart);
cartRouter.get("/", protect, getCart);

export default cartRouter;
