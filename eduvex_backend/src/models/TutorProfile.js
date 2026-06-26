// models/tutorProfile.js
import mongoose from "mongoose";

const tutorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TutorApplication",
      required: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    // Mirrors key info from application for quick access
    fullName: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    experience: { type: String },
    categories: [{ type: String }],
    profilePhotoUrl: { type: String, default: null },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    // Growth fields (populated over time)
    totalStudents: { type: Number, default: 0 },
    totalCourses: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: "tutor_profiles",
  }
);

export default mongoose.model("TutorProfile", tutorProfileSchema);