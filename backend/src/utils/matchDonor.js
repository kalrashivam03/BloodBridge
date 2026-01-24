import Donor from "../models/Donor.js";
import { createNotification } from "../controllers/notification.controller.js";

/* =========================
   BLOOD GROUP COMPATIBILITY
========================= */
const bloodCompatibility = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"]
};

/* =========================
   MATCH DONORS FUNCTION
========================= */
export const matchDonors = async (bloodRequest) => {
    try {
        const compatibleGroups =
            bloodCompatibility[bloodRequest.bloodGroup] || [];

        if (compatibleGroups.length === 0) return [];

        // Find active compatible donors
        const donors = await Donor.find({
            bloodGroup: { $in: compatibleGroups },
            isActive: true
        }).populate("userId", "name email");

        // Notify matched donors
        for (const donor of donors) {
            await createNotification({
                userId: donor.userId._id,
                title: "Urgent Blood Request",
                message: `A ${bloodRequest.bloodGroup} blood request is available at ${bloodRequest.hospital}.`,
                type: "urgent"
            });
        }

        return donors;

    } catch (error) {
        console.error("Donor matching failed:", error.message);
        return [];
    }
};
