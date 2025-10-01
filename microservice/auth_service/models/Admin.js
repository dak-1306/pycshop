import db from "../../db/index.js";
import bcrypt from "bcryptjs";

class Admin {
  static async findByEmail(email) {
    console.log("[ADMIN] Finding admin by email:", email);

    try {
      const [rows] = await db.execute("SELECT * FROM Admin WHERE Email = ?", [
        email,
      ]);
      console.log(
        "[ADMIN] Query result:",
        rows.length > 0 ? "Admin found" : "No admin found"
      );

      return rows[0];
    } catch (error) {
      console.error("[ADMIN] Error in findByEmail:", error);
      throw error;
    }
  }

  static async create({ name, email, password }) {
    console.log("[ADMIN] Creating admin with data:", {
      name,
      email,
    });

    try {
      console.log("[ADMIN] Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("[ADMIN] Password hashed successfully");

      console.log("[ADMIN] Executing SQL INSERT...");
      const result = await db.execute(
        "INSERT INTO Admin (HoTen, Email, MatKhau) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      console.log("[ADMIN] SQL INSERT executed successfully:", result);

      return result;
    } catch (error) {
      console.error("[ADMIN] Error in create:", error);
      console.error("[ADMIN] Error details:", error.message);
      throw error;
    }
  }
}

export default Admin;
