import express from "express";
import { checkAuth, signup, loginUser, logoutUser, googleAuthCallback, facebookAuthCallback, completeOAuthProfile } from "../controllers/auth.controller.js";
import { signupValidation, validate } from "../middlewares/validate.middleware.js";
import { protectUser } from "../middlewares/protectUser.js";
import passport from "passport";



const router = express.Router();

router.post("/signup", signupValidation, validate, signup)
router.get("/check-auth", protectUser, checkAuth);
router.post("/login", loginUser)
router.post("/logout", logoutUser)



// Google OAuth routes
router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"], prompt: "select_account" }));
router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login"
}),
googleAuthCallback
);


// Facebook OAuth routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook OAuth callback
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
}),
    facebookAuthCallback
);
router.post('/complete-profile', completeOAuthProfile);

export default router;