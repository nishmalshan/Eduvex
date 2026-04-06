import { registerUser } from "../services/auth.service.js";


export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log(req.body, 'req.body11111')
        
        const result = await registerUser({ fullName, email, password});
console.log(result,'reg user result')
console.log(result.token,'tokeeeeeeeeeeeeeeeeeeeee')
res.cookie("token", result.token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

        res.status(201).json({
            success: true,
            user: {
                id: result.user._id,
                fullName: result.user.fullName,
                email: result.user.email
            },
            token: result.token
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const checkAuth = (req, res) => {
    try {
        console.log('checkkkkkkkkkkkkkkkkkkkk')
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(req.user,'req.userrrrrr')
console.log(req.user)
        res.json({
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}