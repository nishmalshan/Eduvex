import express from "express";
import { checkAuth, signup } from "../controllers/auth.controller.js";
import { signupValidation, validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/signup", signupValidation, validate, signup)
router.get("/check-auth", protect, checkAuth);

export default router;