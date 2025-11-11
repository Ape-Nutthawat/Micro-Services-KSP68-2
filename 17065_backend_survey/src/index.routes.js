import { Router } from 'express';
import SurveyRouter from './survey/survey.routes.js';

const router = Router();

router.use('/survey', SurveyRouter);

export default router;
