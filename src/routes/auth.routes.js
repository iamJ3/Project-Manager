import { Router } from "express";
import { registerUser,login, logOutUser } from "../controllers/auth.controller.js"
import { validate } from "../middleware/validator.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/index.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/logout").post(verifyJWT,logOutUser);

export default router  