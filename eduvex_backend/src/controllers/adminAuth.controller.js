import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { adminLoginService } from "../services/auth.service.js";


export const adminLogin = async (req, res) => {
    try {
        console.log('555555555555555')
        const { email, password } = req.body;
        const result = await adminLoginService(email, password);
        const { password: _, ...admin } = result.toObject();
        console.log(result,'adminnnnnnnnnnnnn')
        const token = generateToken(admin._id);

        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, admin, token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}