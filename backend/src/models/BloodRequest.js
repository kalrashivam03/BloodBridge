import mongoose from "mongoose";

/* =========================
   BLOOD REQUEST SCHEMA
========================= */
const bloodRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        patientName: {
            type: String,
            required: true,
            trim: true
        },

        bloodGroup: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        },

        units: {
            type: Number,
            required: true,
            min: 1
        },

        hospital: {
            type: String,
            required: true,
            trim: true
        },

        urgency: {
            type: String,
            enum: ["Critical", "High", "Normal"],
            required: true
        },

        contactNumber: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["open", "matched", "fulfilled"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

/* =========================
   INDEXES (FAST LOOKUPS)
========================= */
bloodRequestSchema.index({ bloodGroup: 1 });
bloodRequestSchema.index({ urgency: 1 });
bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ createdAt: -1 });

/* =========================
   MODEL EXPORT
========================= */
const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
export default BloodRequest;
