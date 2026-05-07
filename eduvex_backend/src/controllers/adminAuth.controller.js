import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { adminLoginService } from "../services/auth.service.js";
import { findUserById } from "../repositories/user.repository.js";


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



export const checkAdminAuth = async (req, res) => {
    try {
        const admin = await findUserById(req.admin.id);
                console.log(admin, 'admin')
                if (!admin) {
                    console.log('No admin')
                    return res.status(401).json({ message: "Unauthorized" });
                }

                if (admin.role === 'admin') {
                    
                    res.json({ admin });
                }
        
    } catch (error) {
        
    }
}



export const logoutAdmin = async (req, res) => {
    try {
        console.log('Logout 333333333333333333333')
        res.clearCookie("admin_token", {
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