import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";

/* =========================
   SERVER STARTUP
========================= */
const startServer = async () => {
    try {
        // 1️⃣ Connect to MongoDB
        await connectDB();

        // 2️⃣ Start Express server
        app.listen(ENV.PORT, () => {
            console.log(`🚀 BloodBridge server running on port ${ENV.PORT}`);
        });

    } catch (error) {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1);
    }
};

// Start server
startServer();
