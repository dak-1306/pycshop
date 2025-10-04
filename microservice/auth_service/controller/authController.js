import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import db from "../../db/index.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role = "buyer" } = req.body;
    console.log("🔍 [REGISTER] Extracted data:", {
      name,
      email,
      phone,
      address,
      role,
      hasPassword: !!password,
    });

    // Validate role
    if (!["buyer", "seller"].includes(role)) {
      console.log("[REGISTER] Invalid role:", role);
      return res.status(400).json({ message: "Role must be buyer or seller" });
    }

    console.log("[REGISTER] Checking if email exists:", email);
    const existing = await User.findByEmail(email);
    console.log(
      "[REGISTER] Existing user check result:",
      existing ? "User exists" : "User not found"
    );

    //các trường yêu cầu
    if (!name || !email || !password || !phone || !address) {
      console.log("[REGISTER] Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (existing) {
      console.log("[REGISTER] Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("[REGISTER] Creating new user...");
    await User.create({ name, email, password, phone, address, role });
    console.log("[REGISTER] User created successfully");

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (err) {
    console.error("[REGISTER] Error occurred:", err);
    console.error("[REGISTER] Error stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN] Attempting login for email: ${email}`);

    if (!email || !password) {
      console.log(`[LOGIN] Missing email or password`);
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let user = null;
    let userType = null;
    let passwordField = null;
    let idField = null;
    let nameField = null;
    let roleField = null;

    // First check in Admin table
    console.log(`[LOGIN] Checking admin table...`);
    const admin = await Admin.findByEmail(email);
    if (admin) {
      user = admin;
      userType = "admin";
      passwordField = admin.MatKhau;
      idField = admin.ID_NguoiDung; // Fixed: Use correct admin ID field
      nameField = admin.HoTen;
      roleField = "admin";
      console.log(`[LOGIN] Found admin user`);
    } else {
      // Then check in User table
      console.log(`[LOGIN] Checking user table...`);
      const normalUser = await User.findByEmail(email);
      if (normalUser) {
        user = normalUser;
        userType = "user";
        passwordField = normalUser.MatKhau;
        idField = normalUser.ID_NguoiDung;
        nameField = normalUser.HoTen;
        roleField = normalUser.VaiTro;
        console.log(`[LOGIN] Found user with role: ${roleField}`);
      }
    }

    if (!user) {
      console.log(`[LOGIN] User not found for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`[LOGIN] User found (${userType}), comparing passwords...`);
    let valid;
    try {
      valid = await bcrypt.compare(password, passwordField);
      console.log(`[LOGIN] Password comparison result: ${valid}`);
    } catch (bcryptError) {
      console.error(`[LOGIN] Bcrypt error:`, bcryptError);
      return res.status(500).json({ message: "Authentication error" });
    }

    if (!valid) {
      console.log(`[LOGIN] Invalid password for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`[LOGIN] Password valid, generating token...`);
    let token;
    try {
      token = jwt.sign(
        {
          id: idField,
          role: roleField,
          userType: userType, // admin or user
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRES || "1h",
        }
      );
      console.log(`[LOGIN] Token generated successfully`);
    } catch (jwtError) {
      console.error(`[LOGIN] JWT error:`, jwtError);
      return res.status(500).json({ message: "Token generation error" });
    }

    console.log(`[LOGIN] Login successful for ${userType}: ${user.Email}`);

    // Debug log to check response data
    const responseData = {
      token,
      user: {
        id: idField,
        email: user.Email,
        name: nameField,
        role: roleField,
        userType: userType,
      },
      message: "Login successful",
    };

    console.log(
      `[LOGIN] Response data:`,
      JSON.stringify(responseData, null, 2)
    );

    res.json(responseData);
  } catch (err) {
    console.error("[LOGIN] Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("🔍 [REGISTER_ADMIN] Extracted data:", {
      name,
      email,
      hasPassword: !!password,
    });

    // Check required fields
    if (!name || !email || !password) {
      console.log("[REGISTER_ADMIN] Missing required fields");
      return res.status(400).json({
        message: "All fields are required (name, email, password)",
      });
    }

    console.log("[REGISTER_ADMIN] Checking if admin email exists:", email);
    const existingAdmin = await Admin.findByEmail(email);

    console.log("[REGISTER_ADMIN] Checking if user email exists:", email);
    const existingUser = await User.findByEmail(email);

    console.log(
      "[REGISTER_ADMIN] Existing check result:",
      existingAdmin || existingUser ? "Email exists" : "Email available"
    );

    // Check if email exists in either table
    if (existingAdmin || existingUser) {
      console.log("[REGISTER_ADMIN] Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("[REGISTER_ADMIN] Creating new admin...");
    await Admin.create({ name, email, password });
    console.log("[REGISTER_ADMIN] Admin created successfully");

    res.status(201).json({
      message: "Admin registered successfully",
      success: true,
    });
  } catch (err) {
    console.error("[REGISTER_ADMIN] Error occurred:", err);
    console.error("[REGISTER_ADMIN] Error stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  // Logout FE thường xóa token phía client, BE chỉ cần confirm
  res.json({ message: "Logout successful" });
};

// Become seller (change role to seller and create shop)
export const becomeSeller = async (req, res) => {
  try {
    console.log("🔍 [BECOME_SELLER] All headers:", req.headers);
    console.log("🔍 [BECOME_SELLER] Request body:", req.body);

    const { shopName, shopDescription, shopCategory, shopAddress, shopPhone } =
      req.body;

    // Validate required shop data
    if (
      !shopName ||
      !shopDescription ||
      !shopCategory ||
      !shopAddress ||
      !shopPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin cửa hàng",
      });
    }

    // Get user info from headers (passed from API Gateway) or decode from token
    let userId = req.headers["x-user-id"];
    let userRole = req.headers["x-user-role"];

    // If no headers, try to decode from authorization token
    if (!userId) {
      console.log(
        "🔍 [BECOME_SELLER] No x-user-id header, trying to decode token..."
      );
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.slice(7);
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
          userRole = decoded.role;
          console.log(
            `🔍 [BECOME_SELLER] Decoded from token: userId=${userId}, role=${userRole}`
          );
        } catch (tokenError) {
          console.error(
            "❌ [BECOME_SELLER] Token decode error:",
            tokenError.message
          );
          return res.status(401).json({
            success: false,
            message: "Token không hợp lệ",
          });
        }
      }
    }

    console.log(
      `🔄 [BECOME_SELLER] User ${userId} (current role: ${userRole}) requesting to become seller`
    );

    if (!userId) {
      console.log("❌ [BECOME_SELLER] No userId found in headers or token");
      return res.status(401).json({
        success: false,
        message: "Thông tin người dùng không hợp lệ",
      });
    }

    // Get current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Check if already seller
    if (currentUser.VaiTro === "seller") {
      return res.status(400).json({
        success: false,
        message: "Bạn đã là seller rồi",
      });
    }

    // Find category ID by name
    const [categoryResult] = await db.execute(
      "SELECT ID_DanhMuc FROM danhmuc WHERE TenDanhMuc = ?",
      [shopCategory]
    );

    let categoryId = 1; // Default category
    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].ID_DanhMuc;
    }

    // Get a connection for transaction
    const connection = await db.getConnection();

    try {
      // Begin transaction
      await connection.beginTransaction();

      // Update user role to seller first
      const updated = await User.updateRole(userId, "seller");
      if (!updated) {
        throw new Error("Không thể cập nhật vai trò");
      }

      // Create shop using existing logic
      const insertShopQuery = `
        INSERT INTO cuahang (TenCuaHang, ID_DanhMuc, DiaChiCH, SoDienThoaiCH, NgayCapNhat)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const [shopResult] = await connection.execute(insertShopQuery, [
        shopName,
        categoryId,
        shopAddress,
        shopPhone,
      ]);

      const shopId = shopResult.insertId;
      console.log(`✅ [BECOME_SELLER] Created shop with ID: ${shopId}`);

      // Update user with shop ID
      await connection.execute(
        "UPDATE nguoidung SET ID_CuaHang = ? WHERE ID_NguoiDung = ?",
        [shopId, userId]
      );

      // Commit transaction
      await connection.commit();

      // Release connection
      connection.release();

      // Generate new token with seller role
      const token = jwt.sign(
        {
          id: userId,
          email: currentUser.Email,
          role: "seller",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log(
        `✅ [BECOME_SELLER] User ${userId} is now a seller with shop ${shopId}`
      );

      res.json({
        success: true,
        message: "Chúc mừng! Bạn đã trở thành seller thành công!",
        token,
        user: {
          id: userId,
          name: currentUser.HoTen,
          email: currentUser.Email,
          role: "seller",
          shopId: shopId,
        },
      });
    } catch (transactionError) {
      // Rollback on error
      await connection.rollback();
      connection.release();
      throw transactionError;
    }
  } catch (error) {
    console.error("❌ [BECOME_SELLER] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi trở thành seller",
      error: error.message,
    });
  }
};
