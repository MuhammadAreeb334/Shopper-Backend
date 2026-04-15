import upload from "./multer.js";

export const uploadProductImages = (req, res, next) => {
  const uploader = upload.array("images", 5);
  uploader(req, res, (error) => {
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed" });
    }
    next();
  });
};
