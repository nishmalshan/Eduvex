import express from "express";
const router = express.Router();
import multer from "multer";
import cloudinary from "cloudinary";
cloudinary.v2.config()
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { protect } from "../middlewares/auth.middleware.js";

import { submitApplication, getApplications } from "../controllers/tutor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";



router.post("/tutor-application", protect, submitApplication);
router.get("/tutor-applications", protect, getApplications);



const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "/eduex/tutor_profiles",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 400, height: 400, crop: "fill"}]
    }
})