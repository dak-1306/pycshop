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
        "INSERT INTO nguoidung (HoTen, Email, MatKhau, SoDienThoai, DiaChi, VaiTro) VALUES (?, ?, ?, ?, ?, ?)",
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
        "SELECT * FROM nguoidung WHERE Email = ?",
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

  static async findById(id) {
    console.log("[USER] Finding user by ID:", id);

    try {
      const [rows] = await db.execute(
        "SELECT * FROM nguoidung WHERE ID_NguoiDung = ?",
        [id]
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

  // Update user role
  static async updateRole(userId, newRole) {
    try {
      console.log(`[USER] Updating role for user ${userId} to: ${newRole}`);

      const query = "UPDATE nguoidung SET VaiTro = ? WHERE ID_NguoiDung = ?";
      const [result] = await db.execute(query, [newRole, userId]);

      console.log(`[USER] Role update result:`, result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("[USER] Error updating role:", error);
      throw error;
    }
  }
}

export default User;
