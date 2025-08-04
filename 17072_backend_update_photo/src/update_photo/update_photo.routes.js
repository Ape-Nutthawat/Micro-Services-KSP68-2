import { Router } from 'express';
import * as UpdateMemberController from './update_photo.controller.js';
import { checkTimeOpen, checkTimeEnd} from './update_photo.middleware.js';
import { validateToken } from "../authtoken.js";

const router = Router();

// router.post('/login', validateToken, checkTimeOpen, checkTimeEnd, UpdateMemberController.checkUpdatePhoto);
router.post('/login', validateToken, UpdateMemberController.checkUpdatePhoto);

export default router;
