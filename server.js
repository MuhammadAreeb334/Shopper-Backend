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
    origin: ["https://shopper-clothings.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shopper API is running...",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    // Seed admin only in development
    if (process.env.NODE_ENV !== "production") {
      await seedAdmin();
    }
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();

/* IMPORTANT for Vercel */
export default app;
