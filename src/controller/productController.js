import { v2 as cloudinary } from "cloudinary";
import Product from "../model/Product.js";

export const createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const { name, category, newPrice, oldPrice, available } = req.body;

    if (!name || !category || !newPrice) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and newPrice are required fields",
      });
    }

    const imageUrls = req.files.map((file) => file.path);

    const product = new Product({
      name: name,
      image: imageUrls,
      category: category,
      newPrice: Number(newPrice),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      available: available === "true" || available === true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let finalImages = [];

    if (req.body.existingImages) {
      try {
        finalImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        finalImages = [];
      }
    }

    // Add new uploaded images (Cloudinary URLs)
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((file) => file.path);
      finalImages = [...finalImages, ...newImageUrls];
    }

    // If no images at all, use existing ones
    if (finalImages.length === 0 && existingProduct.image) {
      finalImages = existingProduct.image;
    }

    // Prepare update data
    const updateData = {
      name: req.body.name || existingProduct.name,
      category: req.body.category || existingProduct.category,
      newPrice: req.body.newPrice
        ? Number(req.body.newPrice)
        : existingProduct.newPrice,
      oldPrice: req.body.oldPrice
        ? Number(req.body.oldPrice)
        : existingProduct.oldPrice,
      available:
        req.body.available !== undefined
          ? req.body.available === "true" || req.body.available === true
          : existingProduct.available,
      image: finalImages,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProductById = await Product.findByIdAndDelete(id);

    if (!deleteProductById) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (deleteProductById.image && deleteProductById.image.length > 0) {
      for (const imageUrl of deleteProductById.image) {
        try {
          // Extract public ID from Cloudinary URL
          // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/shopper-products/image.jpg
          const urlParts = imageUrl.split("/");
          const uploadIndex = urlParts.indexOf("upload");
          if (uploadIndex !== -1 && urlParts[uploadIndex + 2]) {
            const publicIdWithVersion = urlParts
              .slice(uploadIndex + 2)
              .join("/");
            const publicId = publicIdWithVersion.split(".")[0];
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image: ${publicId}`);
          }
        } catch (cloudinaryError) {
          console.error(
            "Failed to delete image from Cloudinary:",
            cloudinaryError,
          );
        }
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    if (allProducts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Products Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Fetched All Products", allProducts });
  } catch (error) {
    console.error("Get all products error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "No product found by the ID" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product Fetched", product });
  } catch (error) {
    console.error("Get single product error:", error.message);
    res.status(500).json({
      success: false,
      message: "Invalid ID format or Server Error",
      error: error.message,
    });
  }
};
