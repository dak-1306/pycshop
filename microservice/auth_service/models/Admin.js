import db from "../../db/index.js";
import bcrypt from "bcryptjs";

class Admin {
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute("SELECT * FROM Admin WHERE Email = ?", [
        email,
      ]);

      return rows[0];
    } catch (error) {
      console.error("[ADMIN] Error in findByEmail:", error);
      throw error;
    }
  }

  static async create({ name, email, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.execute(
        "INSERT INTO Admin (HoTen, Email, MatKhau) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      return result;
    } catch (error) {
      console.error("[ADMIN] Error in create:", error);
      console.error("[ADMIN] Error details:", error.message);
      throw error;
    }
  }
}

export default Admin;
