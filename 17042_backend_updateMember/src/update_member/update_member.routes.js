import { Router } from 'express';
import * as UpdateMemberController from './update_member.controller.js';
import { checkTimeOpen1, checkTimeOpen2, checkTimeEnd} from './update_member.middleware.js';
import { validateToken } from "../authtoken.js";

const router = Router();

  router.post('/', validateToken, checkTimeOpen1, checkTimeEnd, UpdateMemberController.updateMember);
  router.post('/login', validateToken, UpdateMemberController.checkMember);
  router.post('/request', validateToken, checkTimeOpen2, checkTimeEnd, UpdateMemberController.request);

// router.post('/', validateToken, UpdateMemberController.updateMember);
// router.post('/login', validateToken, UpdateMemberController.checkMember);
// router.post('/request', validateToken, UpdateMemberController.request);

export default router;
