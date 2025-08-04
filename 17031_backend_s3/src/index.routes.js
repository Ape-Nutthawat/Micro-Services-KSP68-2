import { Router } from 'express';
import s3Router from './s3/s3.routes.js'

const router = Router();

router.use('/s3', s3Router);

export default router;
