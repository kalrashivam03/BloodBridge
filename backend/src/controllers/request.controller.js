import BloodRequest from "../models/BloodRequest.js";
import { createNotification } from "./notification.controller.js";

/* =========================
   CREATE BLOOD REQUEST
========================= */
export const createRequest = async (req, res) => {
    try {
        const {
            patientName,
            bloodGroup,
            units,
            hospital,
            urgency,
            contactNumber
        } = req.body;

        const userId = req.user?.id;

        // 1️⃣ Validate input
        if (
            !patientName ||
            !bloodGroup ||
            !units ||
            !hospital ||
            !urgency ||
            !contactNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "All request fields are required"
            });
        }

        // 2️⃣ Create request
        const request = await BloodRequest.create({
            userId,
            patientName,
            bloodGroup,
            units,
            hospital,
            urgency,
            contactNumber,
            status: "open"
        });

        // 3️⃣ Notify requester
        await createNotification({
            userId,
            title: "Blood Request Submitted",
            message: `Your request for ${bloodGroup} blood has been created.`,
            type: "info"
        });

        return res.status(201).json({
            success: true,
            message: "Blood request created successfully",
            request
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create blood request",
            error: error.message
        });
    }
};

/* =========================
   GET REQUEST BY ID
========================= */
export const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await BloodRequest.findById(id)
            .populate("userId", "name email");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Blood request not found"
            });
        }

        return res.status(200).json({
            success: true,
            request
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch request",
            error: error.message
        });
    }
};

/* =========================
   UPDATE REQUEST STATUS
========================= */
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = ["open", "matched", "fulfilled"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request status"
            });
        }

        const request = await BloodRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Blood request not found"
            });
        }

        request.status = status;
        await request.save();

        // Notify requester
        await createNotification({
            userId: request.userId,
            title: "Request Status Updated",
            message: `Your blood request is now marked as "${status}".`,
            type: status === "fulfilled" ? "info" : "match"
        });

        return res.status(200).json({
            success: true,
            message: "Request status updated",
            request
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update request status",
            error: error.message
        });
    }
};
