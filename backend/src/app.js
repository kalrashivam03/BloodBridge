import express from "express";
import cors from "cors";

/* =========================
   ROUTES
========================= */
import authRoutes from "./routes/auth.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import requestRoutes from "./routes/request.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

/* =========================
   MIDDLEWARES
========================= */
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BloodBridge Backend is running 🚀"
    });
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

/* =========================
   ERROR HANDLER (LAST)
========================= */
app.use(errorMiddleware);

export default app;
