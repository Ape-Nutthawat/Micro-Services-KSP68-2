import { Router } from 'express';
import refundRouter from './refund/refund.routes.js';

const router = Router();

router.use('/refund', refundRouter);

export default router;
