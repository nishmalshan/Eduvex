import User from "../models/User.js";

export const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw error;
    }
}
export const createUser = async (userData) => {
    try {
        return await User.create(userData);
    } catch (error) {
        throw error;
    }
}
export const findUserByGoogleId = async (googleId) => {
    try {
        const user = await User.findOne({ googleId: String(googleId) });
        console.log(user, 'findUserByGoogleId result')
        return user;
    }   catch (error) {
        throw error;
    }
}

export const findUserById = async (id) => {
    try {
        const user = await User.findById(id).select("-password");
        return user;
    }   catch (error) {
        throw error;
    }
}