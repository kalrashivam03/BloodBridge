import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

// Sign up
router.post("/signup", signup);

// Sign in
router.post("/signin", signin);

export default router;
