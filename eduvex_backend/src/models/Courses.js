// models/Course.js
import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        type: {
          type: String,
          enum: ["pdf", "link", "zip", "other"],
          default: "link",
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Section title is required"],
    trim: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  lectures: [lectureSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    thumbnail: {
      type: String, // URL
      default: "",
    },
    previewVideo: {
      type: String, // URL
      default: "",
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all"],
      default: "all",
    },
    language: {
      type: String,
      default: "English",
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    sections: [sectionSchema],
    requirements: [{ type: String, trim: true }],
    learningOutcomes: [{ type: String, trim: true }],
    targetAudience: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "pending_review", "published", "rejected", "archived"],
      default: "draft",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    totalDuration: {
      type: Number, // in seconds, computed
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    certificate: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: compute total lecture count across sections
courseSchema.virtual("computedTotalLectures").get(function () {
  return this.sections.reduce((acc, s) => acc + s.lectures.length, 0);
});

// Pre-save: auto-generate slug from title
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      Date.now();
  }

  // Recompute totals
  this.totalLectures = this.sections.reduce(
    (acc, s) => acc + s.lectures.length,
    0
  );
  this.totalDuration = this.sections.reduce(
    (acc, s) =>
      acc + s.lectures.reduce((la, l) => la + (l.duration || 0), 0),
    0
  );

  next();
});

// Indexes
courseSchema.index({ tutor: 1, status: 1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ "rating.average": -1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;