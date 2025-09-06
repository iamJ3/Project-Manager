import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("email is invalid"),

        body("username")
            .trim()
            .notEmpty().withMessage("username is required")
            .isLowercase().withMessage("Username must be in lowercase")
            .isLength({ min: 3 }).withMessage("username must be at aleast 3 character long"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required"),

        body("full name")
            .optional()
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("email is invalid"),
        body("password")
            .notEmpty()
            .withMessage("password is required")
    ];
};

export {
    userRegisterValidator, userLoginValidator
}