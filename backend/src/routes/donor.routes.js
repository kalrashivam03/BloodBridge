import express from "express";
import {
    registerDonor,
    updateAvailability,
    getActiveDonors
} from "../controllers/donor.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================
   DONOR ROUTES
========================= */

// Register logged-in user as donor
router.post("/register", authMiddleware, registerDonor);

// Update donor availability / active status
router.put("/availability", authMiddleware, updateAvailability);

// Get active donors (filter by bloodGroup / location)
router.get("/", authMiddleware, getActiveDonors);

export default router;
