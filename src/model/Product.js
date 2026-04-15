import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: [String], 
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  newPrice: {
    type: Number, 
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;