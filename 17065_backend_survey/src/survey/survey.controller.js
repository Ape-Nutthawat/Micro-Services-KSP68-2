import SurveyService from './survey.service.js';
import ErrorLogRepository from '../error-log.repository.js';

export const CheckCustomer = async (req, res, next) => {
  // console.log('status customer ', req.body);
  if (!req.body.CustomerID || !req.body.BirthDMY) {
    // console.log('failed Invalid data format');
    return res.status(400).send({
      status: 'failed',
      code: 0,
      message: 'เกิดข้อผิดพลาด <br> Warning',
      cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
    });
  }
  const CustomerID = req.body.CustomerID;
  const BirthDMY = req.body.BirthDMY;
  try {
    const result = await new SurveyService().searchCustomer(CustomerID, BirthDMY);

    if (result) {
      // console.log('Search Customer Success');
      res.status(200).send({
        status: 'success',
        code: 1,
        result,
        message: '-',
        cause: '-',
      });
      return;
    }
    // console.log('data not found');
    return res.status(200).send({
      status: 'success',
      code: 0,
      result: {},
      message: 'ผู้สมัครโปรดทราบ <br> Attention',
      cause:
        'ระบบไม่พบข้อมูลของท่าน<br>กรุณาศึกษาประกาศสำนักงานฯ ข้อ 13.2 (1) <br><br> Please read the Notification of the Secretariat Office of the Teachers ‘Council of Thailand (KHURUSAPHA), clause 13.2 (1)',
    });
  } catch (error) {
    // console.log(' 😎 ~ searchCustomer ~ error : ', error);
    await new ErrorLogRepository().saveErrorLog(error, req);
    next(error);
  }
};

export const Survey = async (req, res, next) => {
  const { CustomerID, BirthDMY, Q1, Q2, Q3, Q4, Q5, Q6 } = req.body;
  try {
    if (!CustomerID || [Q1, Q2, Q3, Q4, Q5, Q6].some((q) => q < 1 || q > 5)) {
      return res.status(400).send({
        status: 'failed',
        code: 1,
        result,
        message: 'เกิดข้อผิดพลาด <br> Warning',
        cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
      });
    }
    const result = await new SurveyService().searchCustomer(CustomerID, BirthDMY);
    if (result) {
      await new SurveyService().addSurvey(CustomerID, Q1, Q2, Q3, Q4, Q5, Q6);
      return res.status(200).send({
        status: 'success',
        code: 1,
        result,
        message: '-',
        cause: '-',
      });
    }
    // console.log('data not found');
    return res.status(200).send({
      status: 'success',
      code: 0,
      result: {},
      message: 'ผู้สมัครโปรดทราบ <br> Attention',
      cause:
        'ระบบไม่พบข้อมูลของท่าน<br>กรุณาศึกษาประกาศสำนักงานฯ ข้อ 13.2 (1) <br><br> Please read the Notification of the Secretariat Office of the Teachers ‘Council of Thailand (KHURUSAPHA), clause 13.2 (1)',
    });
  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    if (error.errno === 1062) {
      // console.log('CustomerID duplicate');
      res.status(400).send({
        status: 'error',
        code: 1062,
        result: {},
        message: 'ผู้สมัครโปรดทราบ <br> Attention',
        cause: 'เลขประจำตัวประชาชนของท่านถูกใช้ในการประเมินความพึงพอใจแล้ว <br> Your ID Card Number Has Already Been Used For Satisfaction Survey.',
      });
      return;
    }
    next(error);
  }
};
