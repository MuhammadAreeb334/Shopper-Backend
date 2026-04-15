import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import productRouter from "./src/route/productRoutes.js";
import authRouter from "./src/route/authRoutes.js";
import cartRoutes from "./src/route/cartRoutes.js";
import paymentRouter from "./src/route/paymentRoutes.js";
import { seedAdmin } from "./src/seedAdmin.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173",],
    credentials: true,
  }),
);
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Shopper is runnung...." });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect DB:", error.message);
    process.exit(1);
  }
};
startServer();
