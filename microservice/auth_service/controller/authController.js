import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import db from "../../db/index.js";
import { sendCartSync } from "../../cart_service/services/kafkaProducer.js";
import { getCartFromRedis } from "../../cart_service/services/redisService.js";
import redis from "../../cart_service/services/redisService.js";

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

export const logout = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không xác định được người dùng",
      });
    }

    console.log(`[LOGOUT] Syncing cart before logout for user: ${userId}`);

    // 1. Lấy cart từ Redis
    const cart = await getCartFromRedis(userId);

    // 2. Gửi sang Kafka để sync về DB
    await sendCartSync(userId, cart);

    // 3. Xóa cache Redis
    await redis.del(`cart:${userId}`);
    await redis.del(`cart_products:${userId}`);

    console.log(
      `[LOGOUT] Cart synced and Redis cache cleared for user: ${userId}`
    );

    res.json({
      success: true,
      message: "Đăng xuất và đồng bộ giỏ hàng thành công",
    });
  } catch (error) {
    console.error("[LOGOUT] Error:", error);
    res.status(500).json({
      success: false,
      message: "Đăng xuất thất bại",
      error: error.message,
    });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    console.log("[GET_CURRENT_USER] Request received");
    console.log("[GET_CURRENT_USER] Headers:", req.headers);

    // Extract user info from headers (set by API Gateway)
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];
    const userType = req.headers["x-user-type"];

    console.log("[GET_CURRENT_USER] User info from headers:", {
      userId,
      userRole,
      userType,
    });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa đăng nhập",
      });
    }

    let user = null;

    // Find user based on userType
    if (userType === "admin") {
      console.log("[GET_CURRENT_USER] Looking for admin user");
      user = await Admin.findById(userId);
      if (user) {
        user = {
          ID_NguoiDung: user.ID_NguoiDung,
          HoTen: user.HoTen,
          Email: user.Email,
          SoDienThoai: user.SoDienThoai || null,
          DiaChi: user.DiaChi || null,
          VaiTro: "admin",
          userType: "admin",
          Avatar: user.Avatar || null,
        };
      }
    } else {
      console.log("[GET_CURRENT_USER] Looking for normal user");
      user = await User.findById(userId);
      if (user) {
        user = {
          ID_NguoiDung: user.ID_NguoiDung,
          TenDangNhap: user.TenDangNhap,
          HoTen: user.HoTen,
          Email: user.Email,
          SoDienThoai: user.SoDienThoai,
          DiaChi: user.DiaChi,
          GioiTinh: user.GioiTinh,
          NgaySinh: user.NgaySinh,
          VaiTro: user.VaiTro,
          userType: "user",
          Avatar: user.Avatar || null,
        };
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    console.log("[GET_CURRENT_USER] User found:", user.Email);

    res.json({
      success: true,
      user: user,
      message: "Lấy thông tin người dùng thành công",
    });
  } catch (error) {
    console.error("[GET_CURRENT_USER] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin người dùng",
      error: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    console.log("[UPDATE_PROFILE] Request received");
    console.log("[UPDATE_PROFILE] Body:", req.body);

    // Extract user info from headers (set by API Gateway)
    const userId = req.headers["x-user-id"];
    const userType = req.headers["x-user-type"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa đăng nhập",
      });
    }

    const { name, email, phone, gender, birthDate, address } = req.body;

    let updatedUser = null;

    if (userType === "admin") {
      // Update admin table
      const [result] = await db.execute(
        "UPDATE admin SET HoTen = ?, Email = ?, SoDienThoai = ?, DiaChi = ? WHERE ID_NguoiDung = ?",
        [name, email, phone || null, address || null, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy admin",
        });
      }

      // Get updated admin
      updatedUser = await Admin.findById(userId);
      if (updatedUser) {
        updatedUser = {
          ID_NguoiDung: updatedUser.ID_NguoiDung,
          HoTen: updatedUser.HoTen,
          Email: updatedUser.Email,
          SoDienThoai: updatedUser.SoDienThoai,
          DiaChi: updatedUser.DiaChi,
          VaiTro: "admin",
          userType: "admin",
        };
      }
    } else {
      // Update user table
      const [result] = await db.execute(
        "UPDATE nguoidung SET HoTen = ?, Email = ?, SoDienThoai = ?, GioiTinh = ?, NgaySinh = ?, DiaChi = ? WHERE ID_NguoiDung = ?",
        [
          name,
          email,
          phone || null,
          gender || null,
          birthDate || null,
          address || null,
          userId,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      // Get updated user
      updatedUser = await User.findById(userId);
      if (updatedUser) {
        updatedUser = {
          ID_NguoiDung: updatedUser.ID_NguoiDung,
          TenDangNhap: updatedUser.TenDangNhap,
          HoTen: updatedUser.HoTen,
          Email: updatedUser.Email,
          SoDienThoai: updatedUser.SoDienThoai,
          DiaChi: updatedUser.DiaChi,
          GioiTinh: updatedUser.GioiTinh,
          NgaySinh: updatedUser.NgaySinh,
          VaiTro: updatedUser.VaiTro,
          userType: "user",
        };
      }
    }

    console.log(
      "[UPDATE_PROFILE] Profile updated successfully for user:",
      userId
    );

    res.json({
      success: true,
      user: updatedUser,
      message: "Cập nhật thông tin thành công",
    });
  } catch (error) {
    console.error("[UPDATE_PROFILE] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật thông tin",
      error: error.message,
    });
  }
};

// Get user addresses
export const getAddresses = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa đăng nhập",
      });
    }

    // For now, return empty addresses array
    // TODO: Create addresses table and implement proper address management
    res.json({
      success: true,
      addresses: [],
      message: "Lấy danh sách địa chỉ thành công",
    });
  } catch (error) {
    console.error("[GET_ADDRESSES] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách địa chỉ",
      error: error.message,
    });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa đăng nhập",
      });
    }

    // TODO: Implement add address functionality
    res.json({
      success: true,
      message: "Thêm địa chỉ thành công",
    });
  } catch (error) {
    console.error("[ADD_ADDRESS] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm địa chỉ",
      error: error.message,
    });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa đăng nhập",
      });
    }

    // TODO: Implement update address functionality
    res.json({
      success: true,
      message: "Cập nhật địa chỉ thành công",
    });
  } catch (error) {
    console.error("[UPDATE_ADDRESS] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật địa chỉ",
      error: error.message,
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa đăng nhập",
      });
    }

    // TODO: Implement delete address functionality
    res.json({
      success: true,
      message: "Xóa địa chỉ thành công",
    });
  } catch (error) {
    console.error("[DELETE_ADDRESS] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa địa chỉ",
      error: error.message,
    });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa đăng nhập",
      });
    }

    // TODO: Implement set default address functionality
    res.json({
      success: true,
      message: "Đặt địa chỉ mặc định thành công",
    });
  } catch (error) {
    console.error("[SET_DEFAULT_ADDRESS] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đặt địa chỉ mặc định",
      error: error.message,
    });
  }
};
