import User from "../models/user.js";

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