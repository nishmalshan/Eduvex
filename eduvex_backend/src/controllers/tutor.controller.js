import mongoose from "mongoose";
import { application, getAllApplications, updateApplicationStatus, getApplicationById, findApprovedTutors, toggleTutorActiveStatus, findApplicationByUserId } from "../repositories/tutor.repository.js";
import { updateUserRole } from "../repositories/user.repository.js";



export const getMyApplication = async (req, res) => {
  try {
    const application = await findApplicationByUserId(req.user.id);
    if (!application) {
      return res.status(404).json({success: false, hasApplied: false, application: null });
    }
    return res.status(200).json({ success: true, hasApplied: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const submitApplication = async (req, res) => {
    try {
        console.log('first')
        const {
            fullName,
            bio,
            skills,
            experience,
            categories,
            linkedin,
            portfolio,
        } = req.body;
        if (!fullName || !bio || !skills || !experience || !categories) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            })
        }

        let parsedSkills, parsedCategories;

        try {
            parsedSkills = JSON.parse(skills);
            parsedCategories = JSON.parse(categories);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid format for skills or categories"
            })
        }
console.log(req.user, 'req.user')
        const result = await application({
            fullName,
            bio,
            skills: parsedSkills,
            experience,
            categories: parsedCategories,
            linkedin: linkedin || '',
            portfolio: portfolio || '',
            profilePhotoUrl: req.file?.path || null,
            userId: req.user.id || req.user
        })
        console.log(result, 'result')

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: {
                id: result._id,
                status: result.status,
                createdAt: result.createdAt
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, errors });
        }
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}



// ── GET /admin/tutor-applications ─────────────────────────────────────────
// Query param: ?status=pending | approved | rejected | under_review | all
export const getApplications = async (req, res) => {
    try {
        const { status } = req.query;

        const applications = await getAllApplications(status || null);

        const shaped = applications.map((app) => ({
            _id: app._id,
            name: app.fullName,
            email: app.userId?.email || "—",
            avatar: app.profilePhotoUrl || null,
            subject: app.categories?.[0] || "—",   // primary category as subject
            categories: app.categories,
            experience: app.experience,
            bio: app.bio,
            linkedin: app.linkedin,
            portfolio: app.portfolio,
            status: app.status,
            createdAt: app.createdAt,
        }));
        // console.log(shaped,'shaped')

        return res.status(200).json({
            success: true,
            applications: shaped,
            total: shaped.length,
        });
    } catch (error) {
        console.error("getApplications error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Please try again later." });
    }
}


// ── PATCH /admin/tutor-applications/:id/approve ───────────────────────────
export const approveApplication = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;

        const existing = await getApplicationById(id);
        if (!existing) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        if (existing.status === "approved") {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Application is already approved." });
        }

        const updated = await updateApplicationStatus(id, "approved");

        if (!existing.userId) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "No user linked to this application." });
        }

        await updateUserRole(existing.userId, "instructor");

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Application approved successfully.",
            application: {
                _id: updated._id,
                name: updated.fullName,
                email: updated.userId?.email || "—",
                avatar: updated.userId?.profilePhoto || null,
                subject: updated.categories?.[0] || "—",
                categories: updated.categories,
                experience: updated.experience,
                status: updated.status,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            },
        });
    } catch (error) {
        session.abortTransaction();
        console.error("approveApplication error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Please try again later." });
    } finally {
        session.endSession();
    }
}


// ── PATCH /admin/tutor-applications/:id/reject ────────────────────────────
export const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getApplicationById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        if (existing.status === "rejected") {
            return res.status(400).json({ success: false, message: "Application is already rejected." });
        }

        const updated = await updateApplicationStatus(id, "rejected");

        return res.status(200).json({
            success: true,
            message: "Application rejected.",
            application: {
                _id: updated._id,
                name: updated.fullName,
                email: updated.userId?.email || "—",
                avatar: updated.userId?.profilePhoto || null,
                subject: updated.categories?.[0] || "—",
                categories: updated.categories,
                experience: updated.experience,
                status: updated.status,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            },
        });
    } catch (error) {
        console.error("rejectApplication error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Please try again later." });
    }
}




// GET /admin/list-tutors
export const getApprovedTutors = async (req, res) => {
    try {
        console.log('111111111111')
        const tutors = await findApprovedTutors();
        const formatted = tutors.map((t) => ({
            _id:      t._id,
            fullName: t.fullName,
            email:    t.userId?.email    ?? "",
            photo:    t.profilePhotoUrl  ?? t.userId?.profilePhoto ?? null,
            categories: t.categories,
            experience: t.experience,
            isBlocked: t.userId?.isBlocked ?? true,
            joined:   t.createdAt,
        }));
        // console.log(formatted, 'formatted tutors')

        return res.status(200).json({ tutors: formatted });
    } catch (error) {
        console.error("getApprovedTutors error:", error);
        return res.status(500).json({ message: "Failed to fetch tutors." });
    }
};

// PATCH /admin/tutors/:id/toggle-status
export const toggleTutorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await toggleTutorActiveStatus(id);

        if (!updated) {
            return res.status(404).json({ message: "Tutor not found." });
        }
console.log(updated,'updated')
        const tutor = {
            _id:      updated._id,
            fullName: updated.fullName,
            email:    updated.userId?.email    ?? "",
            photo:    updated.profilePhotoUrl  ?? null,
            categories: updated.categories,
            experience: updated.experience,
            isBlocked: updated.userId?.isBlocked ?? true,
            joined:   updated.createdAt,
        };

        return res.status(200).json({ tutor });
    } catch (error) {
        console.error("toggleTutorStatus error:", error);
        return res.status(500).json({ message: "Failed to update tutor status." });
    }
};