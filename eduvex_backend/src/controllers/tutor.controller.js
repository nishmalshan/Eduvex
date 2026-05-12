import { application, getAllApplications } from "../repositories/tutor.repository.js";



export const submitApplication = async (req, res) => {
    try {
        const {
            fullName,
            bio,
            skills,
            experience,
            categories,
            linkedIn,
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

        const result = await application({
            fullName,
            bio,
            skills: parsedSkills,
            experience,
            categories: parsedCategories,
            linkedIn: linkedIn || '',
            portfolio: portfolio || '',
            profilePhotoUrl: req.file?.path || null,
            userId: req.user || null
        })

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
        console.log('333333333333333')
        const { status } = req.query;

        const applications = await getAllApplications(status || null);
        console.log(applications, 'applications')

        const shaped = applications.map((app) => ({
            _id: app._id,
            name: app.fullName,
            email: app.userId?.email || "—",
            avatar: app.userId?.profilePhotoUrl || null,
            subject: app.categories?.[0] || "—",   // primary category as subject
            categories: app.categories,
            experience: app.experience,
            bio: app.bio,
            linkedin: app.linkedin,
            portfolio: app.portfolio,
            status: app.status,
            createdAt: app.createdAt,
        }));

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