import TutorApplication from "../models/TutorApplication.js";

export const application = async (applicationData) => {
    try {
        console.log('c3333333')
        const newApplication = new TutorApplication(applicationData);
        await newApplication.save();
        console.log('c4444444444')
        return newApplication;
    } catch (error) {
        throw error;
    }
}