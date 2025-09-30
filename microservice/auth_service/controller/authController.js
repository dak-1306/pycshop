import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    console.log("🔍 [REGISTER] Extracted data:", {
      name,
      email,
      phone,
      address,
      hasPassword: !!password,
    });

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
    await User.create({ name, email, password, phone, address });
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

    const user = await User.findByEmail(email);

    if (!user) {
      console.log(`[LOGIN] User not found for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`[LOGIN] User found, comparing passwords...`);
    let valid;
    try {
      valid = await bcrypt.compare(password, user.MatKhau);
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
        { id: user.ID_NguoiDung, role: user.VaiTro },
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

    console.log(`[LOGIN] Login successful for user: ${user.Email}`);
    res.json({
      token,
      user: {
        id: user.ID_NguoiDung,
        email: user.Email,
        name: user.HoTen,
        role: user.VaiTro,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("[LOGIN] Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  // Logout FE thường xóa token phía client, BE chỉ cần confirm
  res.json({ message: "Logout successful" });
};
