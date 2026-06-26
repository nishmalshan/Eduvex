import { registerUserService, loginService, OAuthService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { findUserByEmail, findUserById } from "../repositories/user.repository.js";
import { findTutorProfileByUserId } from "../repositories/tutor.repository.js";


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


export const checkAuth = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
 console.log(user,'user')
    // For instructors, attach onboardingCompleted from their TutorProfile
    let onboardingCompleted = null;
    if (user.role === "instructor") {
      const tutorProfile = await findTutorProfileByUserId(user._id);
      console.log('dfsf')
      console.log(tutorProfile,'tutor')
      onboardingCompleted = tutorProfile?.onboardingCompleted ?? false;
    }
    
 console.log(onboardingCompleted,'onboardingCompleted')
    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        // Only present for instructors; null for students/admins
        onboardingCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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

const redirectWithToken = (res, user, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:   7 * 24 * 60 * 60 * 1000
    });
console.log('5555555555555555555555555')
    res.redirect(
        `http://localhost:5173/oauth-success?token=${token}&id=${user._id}&name=${user.fullName}&email=${user.email}&isBlocked=${user.isBlocked}`
    );
};


// ── Google ──────────────────────────────────────────────────────────
export const googleAuthCallback = async (req, res) => {
    try {
        const { id: googleId, displayName: fullName, emails, provider } = req.user;
        const email = emails[0].value;

        console.log(req.user, 'google profile');
        

        const { user } = await OAuthService({ provider, googleId, fullName, email });

        
        // Generate JWT
        const token = generateToken(user._id);
        redirectWithToken(res, user, token);

    } catch (error) {
        console.error('Google auth error:', error.message);
        res.redirect('http://localhost:5173/login?error=google_failed');
    }
}

export const facebookAuthCallback = async (req, res) => {
    try {
        console.log('0000000000000000000')
        const { id: facebookId, displayName: fullName, emails, provider } = req.user;
        console.log(req.user, 'req.user 2222222222222222222222222222222')
        // No email — redirect to frontend to collect it
        if (!emails || emails.length === 0) {
            const encodedName = encodeURIComponent(fullName);
            return res.redirect(
                `http://localhost:5173/complete-profile?facebookId=${facebookId}&name=${encodedName}&provider=${provider}`
            );
        }

        // Email is in emails array (confirmed working from your log)
        const email = emails[0].value;
        console.log(email, 'email 33333333333333333')
        const { user } = await OAuthService({ provider, facebookId, fullName, email });
        console.log(user, 'user 4444444444444444444')

        const token = generateToken(user._id);
        redirectWithToken(res, user, token);

    } catch (error) {
        console.error('Facebook auth error:', error.message);
        res.redirect('http://localhost:5173/login?error=facebook_failed');
    }
}


export const completeOAuthProfile = async (req, res) => {
    try {
        const { facebookId, fullName, email, provider } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if email already taken
        const existingUser = await findUserByEmail(email);
        if (existingUser && existingUser.facebookId !== facebookId) {
            return res.status(400).json({ message: 'This email is already registered. Please log in instead.' });
        }

        const { user } = await OAuthService({ provider, facebookId, fullName, email });
        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:   7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            token,
            id:        user._id,
            name:      user.fullName,
            email:     user.email,
            isBlocked: user.isBlocked
        });

    } catch (error) {
        console.error('Complete profile error:', error.message);
        res.status(500).json({ message: 'Failed to complete registration' });
    }
}