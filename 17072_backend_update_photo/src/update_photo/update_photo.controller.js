import UpdatePhotoService from './update_photo.service.js';
import ErrorLogRepository from '../error-log.repository.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */

export const checkUpdatePhoto = async (req, res, next) => {

  if (!req.body.CustomerID || !req.body.BirthDMY) {
    console.log('failed Invalid data format');
    return res.status(400).send({
      status: 'failed',
      code: 0,
      message: 'เกิดข้อผิดพลาด <br> Warning',
      cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
    });
  }
  const { CustomerID, BirthDMY } = req.body;

  // if (!CustomerID || !BirthDMY) {
  //   console.log('failed Invalid data format');
  //   return res.status(400).send({
  //     status: 'failed',
  //     code: 0,
  //     message: 'เกิดข้อผิดพลาด <br> Warning',
  //     cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
  //   });
  // }

  try {
    const updatePhotoService = new UpdatePhotoService();

    const result = await updatePhotoService.getCustomer(CustomerID, BirthDMY);
    if (result.length === 0) {
      return res.status(200).send({
        status: 'success',
        code: 0,
        result: {},
        message: 'ผู้สมัครโปรดทราบ <br> Attention',
        cause: 'ระบบไม่พบข้อมูลของท่าน<br>กรุณาศึกษาประกาศสำนักงานฯ <br><br> Please read the Notification of the Secretariat Office of the Teachers ‘Council of Thailand (KHURUSAPHA)',
      });
    }

    const checkLogUpdateCustomer = await updatePhotoService.checkLogUpdateCustomer(CustomerID);
    if (checkLogUpdateCustomer.length !== 0 && checkLogUpdateCustomer[0].isFileImg === 1) {
      return res.status(200).send({
        status: 'success',
        code: 0,
        result: {},
        message: false,
        cause: '-',
      });
    }

    const checkLogUpdatePhoto = await updatePhotoService.checkLogUpdatePhoto(CustomerID);
    if (checkLogUpdatePhoto.length !== 0) {
      return res.status(200).send({
        status: 'success',
        code: 0,
        result: {},
        message: false,
        cause: '-',
      });
    }

    return res.status(200).send({
      status: 'success',
      code: 1,
      result: result[0],
      message: true,
      cause: '-',
    });

  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    next(error);
  }
};
