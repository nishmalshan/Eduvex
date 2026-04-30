import express from "express";
import { checkAuth, signup, loginUser, logoutUser, googleAuthCallback } from "../controllers/auth.controller.js";
import { signupValidation, validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import passport from "passport";



const router = express.Router();

router.post("/signup", signupValidation, validate, signup)
router.get("/check-auth", protect, checkAuth);
router.post("/login", loginUser)
router.post("/logout", logoutUser)



// Google OAuth routes
router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"], prompt: "select_account" }));
router.get("/auth/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
}),
googleAuthCallback
);

export default router;