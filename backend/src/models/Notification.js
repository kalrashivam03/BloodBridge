import mongoose from "mongoose";

/* =========================
   NOTIFICATION SCHEMA
========================= */
const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["urgent", "match", "info"],
            default: "info"
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

/* =========================
   INDEXES
========================= */
notificationSchema.index({ userId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });

/* =========================
   MODEL EXPORT
========================= */
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
