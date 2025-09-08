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

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword")
            .notEmpty()
            .withMessage("Old password is required"),
        body("newPassword")
            .notEmpty()
            .withMessage("New password is required")
    ];
};


const userForgotPasswordValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("email is invalid"),
    ];
};


const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
            .trim()
            .notEmpty()
            .withMessage("New password is required"),
    ];
};

export {
    userRegisterValidator,
     userLoginValidator,
     userChangeCurrentPasswordValidator,
     userForgotPasswordValidator,
     userResetForgotPasswordValidator,
     

}