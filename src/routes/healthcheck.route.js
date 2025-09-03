import { Router } from "express";
import { healthCheck,notCheck } from "../controllers/healthCheck.controller.js";


const router = Router();

router.route('/').get(healthCheck);
// router.route('/').get(healthCheck).post().delete() for chaining purpose;

router.route('/instagram').get(notCheck)

export default router