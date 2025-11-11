const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ==============================
// Helper: Buat JWT Token
// ==============================
function generateToken(user) {
  const secret = process.env.JWT_SECRET || "kepodeh";
  return jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "30d",
  });
}

// ==============================
// Helper: Register User by Role
// ==============================
async function registerUser(req, res, role) {
  try {
    const { name, email, password, phone } = req.body;

    // ✅ Log biar tau isi body dari frontend
    console.log("📥 Register body:", req.body);

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: `${role} registered successfully`,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(`❌ Error registering ${role}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ==============================
// Helper: Login per Role
// ==============================
async function loginUser(req, res, role) {
  try {
    console.log("📥 Login body:", req.body); // ✅ log tambahan

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: `Access denied. Only ${role} can login here.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      message: `${role} login successful`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`❌ Error logging in ${role}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ==============================
// UNIVERSAL LOGIN (semua role)
// ==============================
exports.login = async (req, res) => {
  try {
    console.log("📥 Universal login body:", req.body); // ✅ log tambahan

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==============================
// EXPORTS per Role
// ==============================
exports.registerAdmin = (req, res) => registerUser(req, res, "admin");
exports.loginAdmin = (req, res) => loginUser(req, res, "admin");

exports.registerStaff = (req, res) => registerUser(req, res, "staff");
exports.loginStaff = (req, res) => loginUser(req, res, "staff");

exports.registerEditor = (req, res) => registerUser(req, res, "editor");
exports.loginEditor = (req, res) => loginUser(req, res, "editor");

exports.registerCustomer = (req, res) => registerUser(req, res, "customer");
exports.loginCustomer = (req, res) => loginUser(req, res, "customer");

// ==============================
// UNIVERSAL REGISTER (baru)
// ==============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    console.log("📥 Universal Register body:", req.body);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }

    // Panggil helper registerUser dengan role sesuai body
    await registerUser(req, res, role);
  } catch (error) {
    console.error("❌ Universal Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

