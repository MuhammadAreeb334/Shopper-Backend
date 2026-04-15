// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./src/config/db.js";
// import productRouter from "./src/route/productRoutes.js";
// import authRouter from "./src/route/authRoutes.js";
// import cartRoutes from "./src/route/cartRoutes.js";
// import paymentRouter from "./src/route/paymentRoutes.js";
// import { seedAdmin } from "./src/seedAdmin.js";

// dotenv.config();

// const app = express();

// /* -------------------- MIDDLEWARE -------------------- */
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://shopper-bice.vercel.app",
//     ],
//     credentials: true,
//   })
// );

// /* Stripe webhook MUST come before express.json */
// app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// app.use(express.json());

// /* REMOVE THIS (not needed anymore with Cloudinary) */
// // app.use("/uploads", express.static("src/uploads"));

// /* -------------------- ROUTES -------------------- */
// app.use("/api/products", productRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/cart", cartRoutes);
// app.use("/api/payment", paymentRouter);

// /* -------------------- HEALTH CHECK -------------------- */
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Shopper API is running...",
//   });
// });

// /* -------------------- DB CONNECTION -------------------- */
// const init = async () => {
//   try {
//     await connectDB();

//     // safe seeding (only for local dev)
//     if (process.env.NODE_ENV !== "production") {
//       await seedAdmin();
//     }

//     console.log("Database connected");
//   } catch (error) {
//     console.error("DB Connection Error:", error.message);
//   }
// };

// init();

// /* IMPORTANT */
// export default app;

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

/* -------------------- MIDDLEWARE -------------------- */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://shopper-bice.vercel.app"],
    credentials: true,
  }),
);

/* Stripe webhook MUST come before express.json */
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRouter);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shopper API is running...",
  });
});

/* -------------------- START SERVER -------------------- */
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
