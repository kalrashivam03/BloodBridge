import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../config/env.js";

/* ======================================================
   AUTH CONTROLLER
====================================================== */

/* =========================
   SIGN UP
   POST /api/auth/signup
========================= */
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1️⃣ Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 2️⃣ Normalize email
        const normalizedEmail = email.toLowerCase();

        // 3️⃣ Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // 4️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5️⃣ Create user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Signup Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Signup failed"
        });
    }
};

/* =========================
   SIGN IN
   POST /api/auth/signin
========================= */
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2️⃣ Normalize email
        const normalizedEmail = email.toLowerCase();

        // 3️⃣ Find user
        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 4️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 5️⃣ Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            ENV.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Signin successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Signin Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Signin failed"
        });
    }
};
