import mongoose from "mongoose";

const tutorFormSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, 'Full name is must at least 2 characters'],
            maxLength: [100, 'Full name must be less than 100 characters']
        },
        bio: {
            type: String,
            required: [true, 'Bio is required'],
            trim: true,
            minlength: [20, 'Bio must be at least 20 characters'],
            maxlength: [2000, 'Bio cannot exceed 2000 characters'],
        },
        experience: {
            type: String,
            required: [true, 'Experience level is required'],
            enum: {
                values: ['beginner', 'intermediate', 'expert', 'master']
            },
        },
        categories: {
            type: [String],
            required: [true, 'At least one teaching category is required'],
            validate: {
                validator: (arr) => arr.length >= 1 && arr.length <= 3,
            },
        },
        // ── Step 3: Profile & Links
        profilePhotoUrl: {
            type: String,           // Stored as URL after upload to cloud storage (e.g. Cloudinary / S3)
            default: null,
        },
        linkedin: {
            type: String,
            trim: true,
            default: '',
            // Stores just the handle — e.g. "johndoe" (not the full URL)
        },
        portfolio: {
            type: String,
            trim: true,
            default: '',
            match: [
                /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/,
                'Please enter a valid URL',
            ],
        },

        // ── Application status (managed by admin)
        status: {
            type: String,
            enum: ['pending', 'under_review', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,       // Adds createdAt + updatedAt automatically
        collection: 'tutor_applications',
    }
);


tutorFormSchema.index({ status: 1, createdAt: -1 }); // For efficient querying of pending applications

export default mongoose.model("TutorForm", tutorFormSchema);