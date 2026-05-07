import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  try {

    const token = req.cookies.admin_token;
    console.log(token, 'admin token')

    if (!token) {
        console.log('No admin token')
      return res.status(401).json({ message: "Admin not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};