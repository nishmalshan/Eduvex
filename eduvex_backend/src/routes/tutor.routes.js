import express from "express";
const router = express.Router();
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { submitApplication, getApplications } from "../controllers/tutor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


// ── cloudinary configuration ─────────────────────────────────────────────
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: "/eduex/tutor_profiles",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 400, height: 400, crop: "fill"}]
    }
})


const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/jpg"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
        }
    }
})


console.log('3333333333333333333333333')
router.post("/tutor-application", protect, upload.single('photo'), submitApplication);
// router.get("/tutor-applications", protect, getApplications);


export default router;