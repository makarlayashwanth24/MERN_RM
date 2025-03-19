const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { sendResetPasswordEmail } = require("../utils/emailService");

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "User registered", user });
    } catch (error) {
        console.error("❌ Registration error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "error", message: "Email and password are required" });
        }

        // ✅ Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        // ✅ Compare raw password with stored hashed password using comparePassword method
        const isMatch = await user.comparePassword(password);

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            status: "success",
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("❌ Login error:", error.message);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

// ✅ Admin Route
router.get("/admin", protect, adminOnly, async (req, res) => {
    try {
        const adminExists = await User.findOne({ email: "admin@gmail.com" });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash("Admin1@", 10);
        const admin = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin"
        });
        await admin.save();

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ message: "Admin created", admin, token });
    } catch (err) {
        console.error("Internal server error from adminAuth", err);
        return res.status(500).json({ message: "Internal server error from adminAuth" });
    }
});

// ✅ Forgot Password Route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await sendResetPasswordEmail(user.email, resetLink);

        res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("❌ Forgot password error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("❌ Reset password error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;