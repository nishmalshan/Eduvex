import TutorApplication from "../models/TutorApplication.js";

export const application = async (applicationData) => {
    try {
        console.log(applicationData,"fffffffffffffff")
        const newApplication = new TutorApplication(applicationData);
        await newApplication.save();
        console.log(newApplication, 'newApplication')
        return newApplication;
    } catch (error) {
        console.log(error.message, 'tutor application error')
        throw error;
    }
}

export const getAllApplications = async (status = null) => {
    const query = status && status !== "all" ? { status } : {};
    return await TutorApplication.find(query)
    .populate("userId", "fullName email profilePhoto")
    .sort({ createdAt: -1 })
}

export const getApplicationById = async (id) => {
    return await TutorApplication.findById(id).populate("userId", "fullName email profilePhoto")
}

export const updateApplicationStatus = async (id, status) => {
    return await TutorApplication.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    ).populate("userId", "fullName email profilePhoto")
}


// Fetch all approved tutors joined with user data
export const findApprovedTutors = async () => {
    return await TutorApplication.find({ status: "approved" })
        .populate("userId", "fullName email profilePhoto createdAt isActive")
        .sort({ createdAt: -1 })
        .lean();
};

// Toggle the isActive flag on the User document linked to a tutor
export const toggleTutorActiveStatus = async (tutorId) => {
    const tutor = await TutorApplication.findOne({ _id: tutorId, status: "approved" })
        .populate("userId")
        .lean();

    if (!tutor) return null;

    const updatedUser = await TutorApplication.findByIdAndUpdate(
        tutor.userId._id,
        { isBlocked: !tutor.userId.isBlocked },
        { new: true, select: "fullName email isBlocked" }
    );

    // Return the tutor shape with the fresh user status merged in
    return { ...tutor, userId: updatedUser };
};

export const findApplicationByUserId = async (userId) => {
  return TutorApplication.findOne({ userId }).lean();
};