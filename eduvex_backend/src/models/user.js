import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            }
        },
        googleId: {
            type: String
        },

        role: {
            type: String,
            enum: ["student", "instructor", "admin"],
            default: "student"
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);