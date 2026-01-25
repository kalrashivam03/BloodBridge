import mongoose from "mongoose";

/* =========================
   DONOR SCHEMA
========================= */
const donorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",   // or "Donor" only if referencing another donor
            required: true
        },

        bloodGroup: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        availability: {
            type: String,
            enum: ["Available Now", "Within 24 Hours", "Within 3 Days"],
            required: true
        },

        lastDonationDate: {
            type: Date,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

/* =========================
   INDEXES (FOR MATCHING)
========================= */
donorSchema.index({ bloodGroup: 1 });
donorSchema.index({ location: 1 });
donorSchema.index({ isActive: 1 });

/* =========================
   MODEL EXPORT
========================= */
const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
