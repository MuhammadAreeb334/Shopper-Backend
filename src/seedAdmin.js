import User from "./model/User.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10,
      );
      await User.create({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL || "admin@shopper.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Default admin created successfully!");
    } else {
      console.log("Admin already exists. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};
