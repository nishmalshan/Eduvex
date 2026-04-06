import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/user.repository.js";


export const registerUser = async ({ fullName, email, password }) => {
    console.log(fullName, email, password,'33333333')
    const existingUser = await findUserByEmail(email);
    console.log(existingUser,'444444444')
    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
console.log(hashpassword,'55555555')
    // Create User
    const user = await createUser({
        fullName,
        email,
        password: hashpassword
    })

console.log(user,'66666666666')
    // Generate JWT
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d"}
    );
console.log(token,'token777777777777777')
    return { user, token}
}