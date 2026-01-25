import Notification from "../models/Notification.js";

/* ======================================================
   NOTIFICATION CONTROLLER
====================================================== */

/* =========================
   CREATE NOTIFICATION
   (Internal use only)
========================= */
export const createNotification = async ({
    userId,
    title,
    message,
    type = "info"
}) => {
    try {
        if (!userId || !title || !message) return;

        await Notification.create({
            userId,
            title,
            message,
            type,
            isRead: false
        });
    } catch (error) {
        console.error("Notification creation failed:", error.message);
    }
};

/* =========================
   GET USER NOTIFICATIONS
   GET /api/notifications
========================= */
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

/* =========================
   MARK NOTIFICATION AS READ
   PATCH /api/notifications/:id/read
========================= */
export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const notification = await Notification.findOne({
            _id: id,
            userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};
