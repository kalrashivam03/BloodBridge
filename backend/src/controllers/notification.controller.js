import Notification from "../models/Notification.js";

/* =========================
   CREATE NOTIFICATION
   (Used internally by system)
========================= */
export const createNotification = async ({
    userId,
    title,
    message,
    type = "info"
}) => {
    try {
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
========================= */
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;

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
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};

/* =========================
   MARK NOTIFICATION AS READ
========================= */
export const markAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
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
            message: "Failed to update notification",
            error: error.message
        });
    }
};
