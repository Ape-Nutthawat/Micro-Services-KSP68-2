import { Router } from 'express';
import * as RefundController from './refund.controller.js';
import { checkTimeOpen, checkTimeEnd, checkTimeEndUpdate } from './refund.middleware.js';
import { validateToken } from '../authtoken.js';

const router = Router();

// router.post('/login', validateToken, checkTimeOpen, checkTimeEnd, RefundController.login);
// router.post('/add', validateToken, checkTimeOpen, checkTimeEnd, RefundController.requestRefund);

router.post('/login', validateToken, RefundController.login);
router.post('/add', validateToken, checkTimeEnd, RefundController.requestRefund);

export default router;
