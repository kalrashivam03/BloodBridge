import Donor from "../models/Donor.js";

/* =========================
   REGISTER AS DONOR
========================= */
export const registerDonor = async (req, res) => {
    try {
        const {
            bloodGroup,
            phone,
            location,
            availability
        } = req.body;

        const userId = req.user?.id; // from auth middleware later

        // 1️⃣ Validate input
        if (!bloodGroup || !phone || !location || !availability) {
            return res.status(400).json({
                success: false,
                message: "All donor fields are required"
            });
        }

        // 2️⃣ Check if donor already exists
        const existingDonor = await Donor.findOne({ userId });
        if (existingDonor) {
            return res.status(409).json({
                success: false,
                message: "Donor already registered"
            });
        }

        // 3️⃣ Create donor profile
        const donor = await Donor.create({
            userId,
            bloodGroup,
            phone,
            location,
            availability,
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Donor registered successfully",
            donor
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to register donor",
            error: error.message
        });
    }
};

/* =========================
   UPDATE DONOR AVAILABILITY
========================= */
export const updateAvailability = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { availability, isActive } = req.body;

        // 1️⃣ Find donor
        const donor = await Donor.findOne({ userId });
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor profile not found"
            });
        }

        // 2️⃣ Update fields
        if (availability) donor.availability = availability;
        if (typeof isActive === "boolean") donor.isActive = isActive;

        await donor.save();

        return res.status(200).json({
            success: true,
            message: "Donor availability updated",
            donor
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update availability",
            error: error.message
        });
    }
};

/* =========================
   GET ACTIVE DONORS (MATCHING)
========================= */
export const getActiveDonors = async (req, res) => {
    try {
        const { bloodGroup, location } = req.query;

        const query = {
            isActive: true
        };

        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (location) query.location = location;

        const donors = await Donor.find(query)
            .populate("userId", "name email");

        return res.status(200).json({
            success: true,
            count: donors.length,
            donors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch donors",
            error: error.message
        });
    }
};
