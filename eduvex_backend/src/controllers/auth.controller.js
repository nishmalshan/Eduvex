import { registerUserService, loginService, googleAuthService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";


export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const result = await registerUserService({ fullName, email, password });

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            user: {
                id: result.newUser._id,
                fullName: result.newUser.fullName,
                email: result.newUser.email,
                isBlocked: result.newUser.isBlocked
            },
            token: result.token
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json({
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginService({ email, password });
        const { password: _, ...user } = result.user.toObject();

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, user, token: result.token });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const googleAuthCallback = async (req, res) => {
    try {
        const googleId = req.user.id;
        const email = req.user.emails[0].value;
        const fullName = req.user.displayName;

        const result = await googleAuthService({ googleId, email, fullName });
        console.log(result,'result')
        
        // Generate JWT
        const token = generateToken(result.user._id);
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        res.redirect(`http://localhost:5173/google-success?token=${token}&id=${result.user._id}&name=${result.user.fullName}&email=${result.user.email}&isBlocked=${result.user.isBlocked}`);
    } catch (error) {
        res.status(500).json({
            message: "Google authentication failed"
        });
    }
}