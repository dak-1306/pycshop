import db from "../../db/index.js";
import bcrypt from "bcryptjs";

class User {
  static async create({
    name,
    email,
    password,
    phone,
    address,
    role = "buyer",
  }) {
    console.log("[USER] Creating user with data:", {
      name,
      email,
      phone,
      address,
      role,
    });

    // Validate role
    if (!["buyer", "seller"].includes(role)) {
      throw new Error("Invalid role. Must be buyer or seller");
    }

    try {
      console.log("[USER] Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("[USER] Password hashed successfully");

      console.log("[USER] Executing SQL INSERT...");
      const result = await db.execute(
        "INSERT INTO NguoiDung (HoTen, Email, MatKhau, SoDienThoai, DiaChi, VaiTro) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hashedPassword, phone, address, role]
      );
      console.log("[USER] SQL INSERT executed successfully:", result);

      return result;
    } catch (error) {
      console.error("[USER] Error in create:", error);
      console.error("[USER] Error details:", error.message);
      throw error;
    }
  }

  static async findByEmail(email) {
    console.log("[USER] Finding user by email:", email);

    try {
      const [rows] = await db.execute(
        "SELECT * FROM NguoiDung WHERE Email = ?",
        [email]
      );
      console.log(
        "[USER] Query result:",
        rows.length > 0 ? "User found" : "No user found"
      );

      return rows[0];
    } catch (error) {
      console.error("[USER] Error in findByEmail:", error);
      throw error;
    }
  }

  static async findById(userId) {
    console.log("[USER] Finding user by ID:", userId);

    try {
      const [rows] = await db.execute(
        "SELECT * FROM NguoiDung WHERE ID_NguoiDung = ?",
        [userId]
      );
      console.log(
        "[USER] Query result:",
        rows.length > 0 ? "User found" : "No user found"
      );

      return rows[0];
    } catch (error) {
      console.error("[USER] Error in findById:", error);
      throw error;
    }
  }

  static async updateRole(userId, newRole) {
    console.log(`[USER] Updating user ${userId} role to:`, newRole);

    // Validate role
    if (!["buyer", "seller", "admin"].includes(newRole)) {
      throw new Error("Invalid role. Must be buyer, seller, or admin");
    }

    try {
      const result = await db.execute(
        "UPDATE NguoiDung SET VaiTro = ? WHERE ID_NguoiDung = ?",
        [newRole, userId]
      );
      console.log("[USER] Role updated successfully:", result);

      return result;
    } catch (error) {
      console.error("[USER] Error in updateRole:", error);
      throw error;
    }
  }
}

export default User;
