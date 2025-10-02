import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Seller from "../models/Seller.js";

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

export const becomeSeller = async (req, res) => {
  try {
    const { shopName, shopDescription, shopCategory, shopAddress, shopPhone } =
      req.body;

    // Get userId from token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      console.log("[BECOME_SELLER] No authorization token provided");
      return res.status(401).json({ message: "Authorization token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      console.log("[BECOME_SELLER] Invalid token:", tokenError.message);
      return res.status(401).json({ message: "Invalid authorization token" });
    }

    const userId = decoded.id;
    console.log(
      `[BECOME_SELLER] Processing seller registration for user ID: ${userId}`
    );

    // Validate required fields
    if (
      !shopName ||
      !shopDescription ||
      !shopCategory ||
      !shopAddress ||
      !shopPhone
    ) {
      console.log("[BECOME_SELLER] Missing required fields");
      return res.status(400).json({
        message:
          "Missing required fields: shopName, shopDescription, shopCategory, shopAddress, shopPhone",
      });
    }

    // Check if user exists
    console.log("[BECOME_SELLER] Checking if user exists...");
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      console.log("[BECOME_SELLER] User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a seller
    if (existingUser.VaiTro === "seller") {
      console.log("[BECOME_SELLER] User is already a seller");
      return res.status(400).json({ message: "User is already a seller" });
    }

    // Check if seller profile already exists
    const existingSeller = await Seller.findByUserId(userId);
    if (existingSeller) {
      console.log("[BECOME_SELLER] Seller profile already exists");
      return res.status(400).json({ message: "Seller profile already exists" });
    }

    // Update user role to seller
    console.log("[BECOME_SELLER] Updating user role to seller...");
    await User.updateRole(userId, "seller");

    // Create seller profile in database
    const sellerData = {
      userId: userId,
      shopName,
      shopDescription,
      shopCategory,
      shopAddress,
      shopPhone,
      status: "active",
    };

    console.log("[BECOME_SELLER] Creating seller profile in database...");
    const sellerResult = await Seller.create(sellerData);
    console.log(
      "[BECOME_SELLER] Seller profile created with ID:",
      sellerResult.insertId
    );

    // Get updated user info
    const updatedUser = await User.findById(userId);

    console.log("[BECOME_SELLER] Seller registration completed successfully");

    res.status(200).json({
      message: "Successfully became a seller",
      user: {
        id: updatedUser.ID_NguoiDung,
        email: updatedUser.Email,
        name: updatedUser.HoTen,
        role: updatedUser.VaiTro,
        shopName: shopName,
      },
      // ✅ SỬA LỖI: Thay sellerProfile bằng object thực tế
      sellerProfile: {
        sellerId: sellerResult.insertId,
        shopName,
        shopDescription,
        shopCategory,
        shopAddress,
        shopPhone,
        status: "active",
      },
      success: true,
    });
  } catch (err) {
    console.error("[BECOME_SELLER] Error occurred:", err);
    console.error("[BECOME_SELLER] Error stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
};
