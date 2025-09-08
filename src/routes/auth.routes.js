import { Router } from "express";
import { registerUser, login, logOutUser, verifyEmail, refreshAccessToken, forgotPasswordReq, resetForgotPassword, getCurrentUser, changeCurrenetPassword, resendEmailVerification } from "../controllers/auth.controller.js"
import { validate } from "../middleware/validator.middleware.js";
import { userRegisterValidator, userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator } from "../validators/index.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

//unserured nomal rooutes
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordReq);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword);


//secure rooutes with jwt
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);a
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);a
router.route("/change-password").post(verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrenetPassword
);




export default router  