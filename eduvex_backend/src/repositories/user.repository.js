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
        console.log('0000000000000000')
        return await User.create(userData);
    } catch (error) {
        throw error;
    }
}
export const findUserByGoogleId = async (googleId) => {
    try {
        console.log(typeof googleId,'4444444444444')
        const user = await User.findOne({ googleId: String(googleId) });
        console.log(user, 'findUserByGoogleId result')
        return user;
    }   catch (error) {
        throw error;
    }
}