import db from "../../db/index.js";
import bcrypt from "bcryptjs";

class User {
  static async create({ name, email, password, phone, address }) {
    console.log("[USER] Creating user with data:", {
      name,
      email,
      phone,
      address,
    });

    try {
      console.log("[USER] Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("[USER] Password hashed successfully");

      console.log("[USER] Executing SQL INSERT...");
      const result = await db.execute(
        "INSERT INTO NguoiDung (HoTen, Email, MatKhau, SoDienThoai, DiaChi) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, phone, address]
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
}

export default User;
