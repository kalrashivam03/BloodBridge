import mongoose from "mongoose";

/* =========================
   USER SCHEMA
========================= */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false // 🔒 never return password by default
        },

        role: {
            type: String,
            enum: ["donor", "patient", "hospital", "admin"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

/* =========================
   MODEL EXPORT
========================= */
const User = mongoose.model("User", userSchema);
export default User;
