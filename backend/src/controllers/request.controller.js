import Request from "../models/BloodRequest.js";
import Donor from "../models/Donor.js";
import { createNotification } from "./notification.controller.js";

/* ======================================================
   REQUEST CONTROLLER
====================================================== */

/* =========================
   CREATE BLOOD REQUEST
   POST /api/requests
========================= */
export const createRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            bloodGroup,
            city,
            hospital,
            units,
            urgency
        } = req.body;

        // 1️⃣ Validate input
        if (!bloodGroup || !city || !hospital || !units) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // 2️⃣ Create blood request
        const request = await Request.create({
            user: userId,
            bloodGroup,
            city,
            hospital,
            units,
            urgency
        });

        // 3️⃣ Find matching donors
        const matchedDonors = await Donor.find({
            bloodGroup,
            city,
            isAvailable: true
        });

        // 4️⃣ Create notifications for matched donors
        for (const donor of matchedDonors) {
            await createNotification({
                // 🔴 IMPORTANT:
                // If your Donor model uses `user` instead of `userId`,
                // change donor.userId → donor.user
                userId: donor.user,
                title: "Blood Match Found 🩸",
                message: `Urgent ${bloodGroup} blood required at ${hospital}, ${city}`,
                type: "match"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Blood request created and donors notified",
            request,
            notifiedDonors: matchedDonors.length
        });

    } catch (error) {
        console.error("Create Request Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create blood request"
        });
    }
};

/* =========================
   GET ALL REQUESTS
   GET /api/requests
========================= */
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch requests"
        });
    }
};

/* =========================
   GET MY REQUESTS
   GET /api/requests/my
========================= */
export const getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const requests = await Request.find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your requests"
        });
    }
};

/* =========================
   GET REQUEST BY ID
   GET /api/requests/:id
========================= */
export const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findById(id)
            .populate("user", "name email");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        return res.status(200).json({
            success: true,
            request
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch request"
        });
    }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request status updated",
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
