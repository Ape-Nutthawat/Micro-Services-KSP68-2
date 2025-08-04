import RegisterService from './register.service.js';
import ErrorLogRepository from '../error-log.repository.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */

export const createCustomer = async (req, res, next) => {
  // console.log('createCustomer : ', req.body.data.CustomerID);
  if (!req.body.data || !req.body.datafile) {
    // console.log("failed Invalid data format");
    return res.status(400).send({
      status: 'failed',
      code: 0,
      message: 'เกิดข้อผิดพลาด <br> Warning',
      cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
    });
  }
  const registerData = req.body.data;
  const registerFileData = req.body.datafile;
  try {
    registerData.ip = req.ip;
    await new RegisterService().addCustomer(registerData, registerFileData);
    // console.log("insert data success");
    return res.status(200).send({
      status: 'success',
      code: 1,
      result: {},
      message: '-',
      cause: '-',
    });
  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    if (error.errno === 1062) {
      console.log("CustomerID duplicate");
      res.status(400).send({
        status: 'error',
        code: 1062,
        result: {},
        message: 'เลขประจำตัวประชาชนของท่านถูกใช้ในการสมัครครั้งนี้แล้ว <br> Your ID Card Number Has Already Been Used For Registration.',
        cause: '',
      });
      return;
    }
    next(error);
  }
};
