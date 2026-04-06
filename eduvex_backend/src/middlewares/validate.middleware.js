import { body, validationResult } from "express-validator";

export const signupValidation = [
    body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

    body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

    body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Password must contain uppercase, number and special character")
];

export const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    next();
}