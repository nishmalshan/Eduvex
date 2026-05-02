import { application } from "../repositories/tutor.repository.js";



export const submitApplication = async (req, res) => {
    try {
        console.log('c1111111111')
        const {
            fullName,
            bio,
            skills,
            experience,
            categories,
            linkedIn,
            portfolio,
        } = req.body;

        console.log(req.body, 'req.body')
        console.log(typeof req.file.path,'req.file')

        if (!fullName || !bio || !skills || !experience || !categories) {
            console.log('eeeeeeeeeeeee')
            return res.status(400).json({ success: false,
                message: "Please fill in all required fields"
            })
        }

        let parsedSkills, parsedCategories;

        try {
            console.log('c222222222222')
            parsedSkills = JSON.parse(skills);
            parsedCategories = JSON.parse(categories);
            console.log(parsedSkills, 'parsedSkills')
            console.log(parsedCategories, 'parsedCategories')
        } catch (error) {
            console.log(error,'catch')
            return res.status(400).json({ success: false,
                message: "Invalid format for skills or categories"
            })
        }
        console.log(req.user,'req.user')

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
        console.log(result, "c555555555")
        return res.status(201).json({ success: true,
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



export const getApplications = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}