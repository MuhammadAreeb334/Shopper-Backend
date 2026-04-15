import express from "express";
import { uploadProductImages } from "../middleware/uploadProductImages.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
} from "../controller/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const productRouter = express.Router();

productRouter.get("/", getAllProduct);
productRouter.get("/:id", getSingleProduct);
productRouter.post("/", protect, adminOnly, uploadProductImages, createProduct);
productRouter.patch("/:id", protect, adminOnly, uploadProductImages, updateProduct);
productRouter.delete("/:id", protect, adminOnly, deleteProduct);
// productRouter.post("/json", UploadProductImage);

export default productRouter;
