import Product from "../model/Product.js";

// export const UploadProductImage = async (req, res) => {
//   try {
//     const files = req.files;

//     if (!files || files.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Images are required" });
//     }
//     const imageUrls = files.map((file) => `/uploads/${file.filename}`);
//     res.status(200).json({
//       status: true,
//       message: "Uploaded Image Successfuly",
//       images: imageUrls,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//     console.log(error.message);
//   }
// };

export const createProduct = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.lenght === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Images are required" });
    }
    const imageUrls = files.map((file) => `/uploads/${file.filename}`);
    const product = new Product({
      name: req.body.name,
      image: imageUrls,
      category: req.body.category,
      newPrice: Number(req.body.newPrice),
      oldPrice: Number(req.body.oldPrice),
      available: req.body.available,
    });
    await product.save();
    res.status(200).json({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log(error.message);
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
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log(error.message);
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    if (allProducts.length === 0) {
      return res.status(404).json({ success: false, message: "No Products" });
    }
    res
      .status(200)
      .json({ success: true, message: "Fetched All Products", allProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log(error.message);
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
    res.status(500).json({
      success: false,
      message: "Invalid ID format or Server Error",
      error: error.message,
    });
    console.log(error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Incoming Body:", req.body);
    const updateData = { ...req.body };
    let finalImages = [];

    if (req.body.existingImages) {
      finalImages = JSON.parse(req.body.existingImages);
    }

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(
        (file) => `/uploads/${file.filename}`,
      );
      finalImages = [...finalImages, ...newImagePaths];
    }

    updateData.image = finalImages;

    delete updateData.existingImages;
    delete updateData.removedImages;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "No Product found" });
    }

    res.status(200).json({
      success: true,
      message: "Updated Product",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
