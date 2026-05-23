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
    } catch (error) {
        throw error;
    }
}

export const findUserById = async (id) => {
    try {
        const user = await User.findById(id).select("-password");
        return user;
    } catch (error) {
        throw error;
    }
}

export const getUsers = async () => {
    return await User.find({ role: { $ne: "admin" } })
        .select("-password")
        .sort({ createdAt: -1 });
}

export const findUserByIdAndUpdate = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true, select: "-password" }).select("-password");
}

// user.repository.js

export const updateUserRole = async (userId, role) => {
    return await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    );
}