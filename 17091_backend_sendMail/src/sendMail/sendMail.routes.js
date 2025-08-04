import { Router } from 'express';
import * as RequestController from './sendMail.controller.js';
import { validateToken } from '../authtoken.js';

const router = Router();

router.post('/', validateToken, RequestController.sendMail);
router.post('/payment', validateToken, RequestController.sendMailPayment)


export default router;


function classifyDegree(name) {
  const text = name.toLowerCase();

  if (text.includes('ประกาศนียบัตร')) return { type: 'ประกาศนียบัตรบัณฑิต', condition: 'ปี 2 ขึ้นไป' };
  if (text.includes('มหาบัณฑิต') || text.includes('ปริญญาโท')) return { type: 'ปริญญาโท', condition: 'ปี 2 ขึ้นไป' };
  if (text.includes('บัณฑิต') || text.includes('ปริญญาตรี')) return { type: 'ปริญญาตรี', condition: 'ปี 3 4 5' };

  return { type: 'ไม่ทราบระดับ', condition: '-' };
}