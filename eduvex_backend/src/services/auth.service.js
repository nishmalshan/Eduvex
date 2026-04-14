import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/user.repository.js";


export const registerUser = async ({ fullName, email, password }) => {
    try {
        console.log(fullName, email, password,'33333333')
    const user = await findUserByEmail(email);
    console.log(user,'444444444')
    if (user) {
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
console.log(hashpassword,'55555555')
    // Create User
    const newUser = await createUser({
        fullName,
        email,
        password: hashpassword
    })

console.log(newUser,'66666666666')
    // Generate JWT
    const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d"}
    );

    return { newUser, token}

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const loginService = async ({ email, password }) => {
    try {
        console.log("login3333333333333333333333333")
        const user = await findUserByEmail(email);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
console.log("login444444444444444444444444444444444")
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
console.log("login55555555555555555555555555555555555")
        return { user, token }

    } catch (error) {
        throw new Error(error.message);
    }
}