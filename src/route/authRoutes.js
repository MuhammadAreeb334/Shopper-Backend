import express from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/google", googleAuth);

export default authRouter;
