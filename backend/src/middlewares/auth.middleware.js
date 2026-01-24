import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

/* =========================
   AUTH MIDDLEWARE
========================= */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1️⃣ Check token presence
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        // 2️⃣ Verify token
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        // 3️⃣ Attach user to request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;
