import RefundService from './refund.service.js';
import ErrorLogRepository from '../error-log.repository.js';
import axios from 'axios';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */

export const login = async (req, res, next) => {
  if (!req.body.CustomerID || !req.body.BirthDMY) {
    return res.status(400).send({
      status: 'failed',
      code: 0,
      message: 'เกิดข้อผิดพลาด',
      cause: 'รูปแบบข้อมูลไม่ถูกต้อง',
    });
  }
  const CustomerID = req.body.CustomerID;
  const BirthDMY = req.body.BirthDMY;
  try {
    const result = await new RefundService().searchCustomer(CustomerID, BirthDMY);
    if (result.length !== 0) {
      const checkRefund = await new RefundService().checkRefund(CustomerID);
      if (checkRefund.length !== 0) {
        return res.status(200).send({
          status: 'success',
          code: 0,
          result: checkRefund[0],
          message: 'ผู้สมัครโปรดทราบ',
          cause: 'เลขประจำตัวประชาชนของท่านถูกใช้ในการยื่นขอเงินคืนแล้ว',
        });
      }
      return res.status(200).send({
        status: 'success',
        code: 1,
        result: result[0],
        message: '-',
        cause: '-',
      });
    } else {
      return res.status(200).send({
        status: 'success',
        code: 0,
        result: [],
        message: 'ผู้สมัครโปรดทราบ',
        cause: 'ระบบไม่พบข้อมูลของท่าน',
      });
    }
  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    next(error);
  }
};

export const requestRefund = async (req, res, next) => {
  const { CustomerID, Name1, Name2, Name3, Email, Tel, BankName, AccountName, AccountNo, FileBookBank, FileEvidence, IP } = req.body;
  try {
    const result = await new RefundService().checkCustomer(CustomerID);

    if (result.length !== 0) {
      const checkPermissionRefund = await new RefundService().checkPermissionRefund(CustomerID);

      if (checkPermissionRefund.length !== 0) {
        return res.status(200).send({
          status: 'success',
          code: 0,
          result: {},
          message: 'ผู้สมัครโปรดทราบ',
          cause: 'ท่านยื่นคำร้องขอคืนเงินแล้ว',
        });
      }

      await new RefundService().insertRequestRefund(CustomerID, Name1, Name2, Name3, Email, Tel, BankName, AccountName, AccountNo, FileBookBank, FileEvidence, IP );


      return res.status(200).send({
        status: 'success',
        code: 1,
        result: {},
        message: '-',
        cause: '-',
      });
    } else {
      return res.status(200).send({
        status: 'success',
        code: 0,
        result: {},
        message: 'ผู้สมัครโปรดทราบ',
        cause: 'ระบบไม่พบข้อมูลของท่าน',
      });
    }
  } catch (error) {
    if (error.errno === 1062) {
      res.status(400).send({
        status: 'error',
        code: 1062,
        result: {},
        message: 'ผู้สมัครโปรดทราบ',
        cause: 'เลขประจำตัวประชาชนของท่านถูกใช้ในการยื่นขอเงินคืนแล้ว',
      });
      return;
    }
    if (axios.isAxiosError(error)) {
      const { data } = error.response;
      return res.status(400).send({
        status: 'error',
        code: 0,
        result: data,
        message: '-',
        cause: '-',
      });
    }
    next(error);
  }
};