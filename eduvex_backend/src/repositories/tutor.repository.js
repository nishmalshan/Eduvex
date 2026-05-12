import TutorApplication from "../models/TutorApplication.js";

export const application = async (applicationData) => {
    try {
        const newApplication = new TutorApplication(applicationData);
        await newApplication.save();
        return newApplication;
    } catch (error) {
        throw error;
    }
}

export const getAllApplications = async (status = null) => {
    const query = status && status !== "all" ? { status } : {};
    return await TutorApplication.find(query)
    .populate("userId", "name email profilePhoto")
    .sort({ createdAt: -1 })
}