import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, findUserByGoogleId } from "../repositories/user.repository.js";
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
        res.status(400).json({ success: false, message: error.message });
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

export const googleAuthService = async (data) => {
    try {
        let user;

        // Check user with googleId
        user = await findUserByGoogleId(data.googleId);

        // If not found check with email
        if (!user) {
            user = await findUserByEmail(data.email);
            // User exists with email signup
            if (user) {
                user.googleId = data.googleId;
                await user.save();
            }
        }

        if (!user) {
            const newUser = await createUser({
                googleId: data.googleId,
                fullName: data.fullName,
                email: data.email
            });
            return { user: newUser };
        }

        return { user };
    } catch (error) {

    }
}