import { registerUser, loginService } from "../services/auth.service.js";


export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log(req.body, 'req.body11111')
        
        const result = await registerUser({ fullName, email, password});
console.log(result,'reg user result')
console.log(result.token,'tokeeeeeeeeeeeeeeeeeeeee')
console.log(result.u)
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
console.log(req.user)
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
        console.log(result,'login result')
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