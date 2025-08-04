import { Router } from 'express';
import updatePhotoRouter from './update_photo/update_photo.routes.js';

const router = Router();

router.use('/update2', updatePhotoRouter);

export default router;
