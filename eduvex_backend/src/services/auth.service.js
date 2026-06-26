import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, findUserByGoogleId, findUserByFacebookId } from "../repositories/user.repository.js";
import { generateToken } from "../utils/generateToken.js"


export const registerUserService = async ({ fullName, email, password }) => {
    try {
        const user = await findUserByEmail(email);
        if (user) {
            throw new Error("User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = await createUser({
            fullName,
            email,
            password: hashpassword
        })

        // Generate JWT
        const token = generateToken(newUser._id);

        return { newUser, token }

    } catch (error) {
        throw new Error(error.message);
    }
}


export const loginService = async ({ email, password }) => {
    try {
        const user = await findUserByEmail(email);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // Generate JWT
        const token = generateToken(newUser._id);

        return { user, token }

    } catch (error) {
        throw new Error(error.message);
    }
}

export const OAuthService = async (data) => {
    try {
        let user;

        if (data.provider === 'google') {

            user = await findUserByGoogleId(data.googleId);

            if (!user) {
                user = await findUserByEmail(data.email);
                if (user) {
                    // Existing account (email/password or Facebook) — link Google
                    user.googleId = data.googleId;
                    await user.save();
                }
            }

            if (!user) {
                user = await createUser({
                    googleId: data.googleId,
                    fullName: data.fullName,
                    email:    data.email,
                });
            }

        } else if (data.provider === 'facebook') {

            user = await findUserByFacebookId(data.facebookId);

            if (!user) {
                user = await findUserByEmail(data.email);
                if (user) {
                    // Existing account (email/password or Google) — link Facebook
                    user.facebookId = data.facebookId;
                    await user.save();
                }
            }

            if (!user) {
                user = await createUser({
                    facebookId: data.facebookId,
                    fullName:   data.fullName,
                    email:      data.email,
                });
            }

        } else {
            throw new Error(`Unsupported OAuth provider: ${data.provider}`);
        }

        return { user };

    } catch (error) {
        throw new Error(error.message);
    }
}




// Admin Service

export const adminLoginService = async (email, password) => {
    try {
        const admin = await findUserByEmail(email);
        if (!admin) {
            throw new Error("Invalid credentials");
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        return admin;
    } catch (error) {
        throw new Error(error.message);
    }
}