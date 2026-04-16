import upload from "./multer.js";

export const uploadProductImages = (req, res, next) => {
  const uploader = upload.array("images", 5);
  uploader(req, res, (error) => {
    if (error) {
      // console.error("Upload error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Image upload failed",
      });
    }

    // if (req.files) {
    //   console.log(`Uploaded ${req.files.length} files to Cloudinary`);
    //   req.files.forEach((file, index) => {
    //     console.log(`File ${index + 1}: ${file.path}`);
    //   });
    // }

    next();
  });
};
