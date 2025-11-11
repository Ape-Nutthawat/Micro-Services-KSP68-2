import { Router } from 'express';
import * as SurveyController from './survey.controller.js';
import { validateToken } from "../authtoken.js";

const router = Router();

router.post('/check',validateToken , SurveyController.CheckCustomer);
router.post('/',validateToken , SurveyController.Survey);

export default router;
