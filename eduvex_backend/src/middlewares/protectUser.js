import jwt from "jsonwebtoken";

export const protectUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;

        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}