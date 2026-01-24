import express from "express";
import {
    createRequest,
    getRequestById,
    updateRequestStatus
} from "../controllers/request.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================
   BLOOD REQUEST ROUTES
========================= */

// Create a new blood request
router.post("/", authMiddleware, createRequest);

// Get a blood request by ID
router.get("/:id", authMiddleware, getRequestById);

// Update request status (open → matched → fulfilled)
router.put("/:id/status", authMiddleware, updateRequestStatus);

export default router;
