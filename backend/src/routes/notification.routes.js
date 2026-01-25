import express from "express";
import {
    getUserNotifications,
    markAsRead
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
// import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================
   NOTIFICATION ROUTES
========================= */

// Get all notifications for logged-in user
router.get("/", authMiddleware, getUserNotifications);

// Mark a notification as read
router.put("/:id/read", authMiddleware, markAsRead);

export default router;
