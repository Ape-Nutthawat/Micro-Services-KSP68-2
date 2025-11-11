import UpdateMemberService from './update_member.service.js';
import ErrorLogRepository from '../error-log.repository.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */

export const checkMember = async (req, res, next) => {
  if (!req.body.CustomerID) {
    return res.status(400).send({
      status: 'failed',
      code: 0,
      message: 'เกิดข้อผิดพลาด <br> Warning',
      cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
    });
  }
  const CustomerID = req.body.CustomerID;
  try {
    const member = await new UpdateMemberService().checkMember(CustomerID);
    const checkRequest = await new UpdateMemberService().checkRequest(CustomerID);

    if (member) {
      if (checkRequest && checkRequest.StatusApprove === 1) {
        return res.status(200).send({
          status: 'success',
          code: 2,
          result: checkRequest,
          message: 'ผ่าน',
          cause: 'ท่านสามารถยื่นคำร้องขอสิทธิในการสมัครสอบได้',
          causeEN: 'Pass',
        });
      }

      const checkLog = await new UpdateMemberService().checkLog(CustomerID);
      if (checkLog !== false) {
        return res.status(200).send({
          status: 'success',
          code: 1,
          result: member,
          message: '-',
          cause: '-',
          causeEN: '-',
        });
      }
      return res.status(200).send({
        status: 'success',
        code: 0,
        result: member,
        message: 'เลขประจำตัวประชาชนของท่านมีการตรวจสอบสิทธิและแก้ไขข้อมูลแล้ว <br> (Your ID card number has been edited)',
        cause: '',
        causeEN: '',
      });
    }
    if (checkRequest && checkRequest.StatusApprove !== 1) {
      return res.status(200).send({
        status: 'success',
        code: 4,
        result: checkRequest,
        message: checkRequest.StatusApprove === 2 ? 'รอตรวจสอบ' : checkRequest.StatusApprove === 3 ? 'ท่านไม่มีสิทธิสมัครสอบ' : 'ไม่ผ่าน',
        cause:
          checkRequest.StatusApprove === 2
            ? '-'
            : 'เนื่องจาก ' + (!checkRequest.RemarkRequest || checkRequest.RemarkRequest === null || checkRequest.RemarkRequest === '' ? '-' : checkRequest.RemarkRequest),
        causeEN: checkRequest.StatusApprove === 2 ? 'Waiting for validation' : 'Failed',
      });
    }
    return res.status(200).send({
      status: 'success',
      code: 3,
      result: [],
      message: '<b> ไม่พบข้อมูลของท่าน โปรดดำเนินการ ดังนี้ <br> (Your information was not found. Please proceed as follows) </b>',
      cause: `
      <div style="text-align:left">
        <br> <b>1) กรณีผู้ตรวจสอบสิทธิไม่เคยสมัครเข้ารับการทดสอบ ให้แจ้งผลการ<a style="color:blue">ตรวจสอบสิทธิให้กับสถาบันอุดมศึกษาของตนเอง</a> </b> เพื่อให้สถาบันฯ ดำเนินการในส่วนที่เกี่ยวข้อง <br> 
        1) In the case of the candidates who have never registered for the examination, the candidates must inform <a style="color:blue">the results of the eligibility to their own higher education institution</a>, for the institution to proceed with the relevant actions accordingly.
        <br>
        <br> <b>2) กรณีผู้ตรวจสอบสิทธิเป็นผู้ไม่ผ่านเกณฑ์การทดสอบครั้งที่ผ่านมา ให้แจ้งผลการตรวจสอบสิทธิกับสำนักงานเลขาธิการคุรุสภา </b> <a style="color:red">ผ่านระบบรับสมัครสอบ ในวันที่ 5 - 11 กันยายน 2568 </a><br> 
        2) In the case of the candidates who did not pass in the previous examination, the candidates must inform the results of the eligibility to the Office of the Secretary-General of the Teachers' Council of Thailand <a style="color:red">through the exam registration system between September 5 - 11, 2025</a>
      </div>
      <br><b> ทั้งนี้ ขอให้ท่านดำเนินการไม่เกินวันที่ 5 - 11 กันยายน 2568 (Please proceed within September 5 - 11, 2025.)</b>`,
    });
  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  if (!req.body.CustomerID) {
    return res.status(400).send({
      status: 'failed',
      code: 0,
      message: 'เกิดข้อผิดพลาด <br> Warning',
      cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
    });
  }
  const body = req.body;
  try {
    const oldData = await new UpdateMemberService().checkMember(body.CustomerID);
    if (oldData !== false) {
      await new UpdateMemberService().insertLogUpdateMember(body, oldData);
      await new UpdateMemberService().updateMember(body);
      console.log('Update Member Success');
      return res.status(200).send({
        status: 'success',
        code: 1,
        message: '-',
        cause: '-',
      });
    }
    res.status(200).send({
      status: 'success',
      code: 3,
      result: [],
      message: '<b> ไม่พบข้อมูลของท่าน โปรดดำเนินการ ดังนี้ <br> (Your information was not found. Please proceed as follows) </b>',
      cause: `
      <div style="text-align:left">
        <br> <b>1) กรณีผู้ตรวจสอบสิทธิไม่เคยสมัครเข้ารับการทดสอบ ให้แจ้งผลการ<a style="color:blue">ตรวจสอบสิทธิให้กับสถาบันอุดมศึกษาของตนเอง</a> </b> เพื่อให้สถาบันฯ ดำเนินการในส่วนที่เกี่ยวข้อง <br> 
        1) In the case of the candidates who have never registered for the examination, the candidates must inform <a style="color:blue">the results of the eligibility to their own higher education institution</a>, for the institution to proceed with the relevant actions accordingly.
        <br>
        <br> <b>2) กรณีผู้ตรวจสอบสิทธิเป็นผู้ไม่ผ่านเกณฑ์การทดสอบครั้งที่ผ่านมา ให้แจ้งผลการตรวจสอบสิทธิกับสำนักงานเลขาธิการคุรุสภา </b> <a style="color:red">ผ่านระบบรับสมัครสอบ ในวันที่ 5 - 11 กันยายน 2568 </a><br> 
        2) In the case of the candidates who did not pass in the previous examination, the candidates must inform the results of the eligibility to the Office of the Secretary-General of the Teachers' Council of Thailand <a style="color:red">through the exam registration system between September 5 - 11, 2025</a>
      </div>
      <br><b> ทั้งนี้ ขอให้ท่านดำเนินการไม่เกินวันที่ 5 - 11 กันยายน 2568 (Please proceed within September 5 - 11, 2025.)</b>`,
    });
    //   cause: `
    //   <div style="text-align:left">
    //     <br> <b>1) กรณีเป็นผู้ศึกษาในหลักสูตรปริญญาทางการศึกษา หรือเทียบเท่าที่คุรุสภารับรอง ให้แจ้งผลการ<a style="color:blue">ตรวจสอบสิทธิกับสถาบันอุดมศึกษาของตนเอง</a> </b> เพื่อให้สถาบันฯ ดำเนินการในส่วนที่เกี่ยวข้อง <br> 
    //     1) If you are a student enrolled in an education degree program or an equivalent program recognized by the Teachers' Council of Thailand (Kurusapha), please report the eligibility <a style="color:blue">verification results to your own university </a> for them to proceed with the relevant actions.
    //     <br>
    //     <br> <b>2) กรณีเป็นผู้ผ่านการรับรองความรู้ตามมาตรฐานวิชาชีพ ให้แจ้งผลการ<a style="color:blue">ตรวจสอบสิทธิกับทางสำนักงานเลขาธิการคุรุสภา</a> </b><br> 
    //     2) If you have been certified for professional knowledge according to professional standards, please report the eligibility <a style="color:blue">verification results to the Secretariat of the Teachers' Council of Thailand (Kurusapha).</a>
    //   </div>
    //   <br><b> ทั้งนี้ ขอให้ท่านดำเนินการภายในวันที่ 5 - 11 กันยายน 2568 (Please proceed within September 5 - 11, 2025.)</b>`,
    // });
  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    if (error.errno === 1062) {
      console.log('CustomerID duplicate');
      res.status(400).send({
        status: 'error',
        code: 1062,
        result: {},
        message: 'เลขประจำตัวประชาชนของท่านมีการตรวจสอบสิทธิและแก้ไขข้อมูลแล้ว <br> (your ID card number has been edited)',
        cause: '',
      });
      return;
    }
    next(error);
  }
};

export const request = async (req, res, next) => {
  console.log('createRequest : ', req.body.data.CustomerID);
  if (!req.body.data) {
    console.log('failed Invalid data format');
    return res.status(400).send({
      status: 'failed',
      code: 0,
      message: 'เกิดข้อผิดพลาด <br> Warning',
      cause: 'รูปแบบข้อมูลไม่ถูกต้อง <br> Invalid Data Format.',
    });
  }
  const registerData = req.body.data;
  try {
    const check = await new UpdateMemberService().getCheckAdd(req.body.data.CustomerID);
    if (check) {
      return res.status(200).send({
        status: 'success',
        code: 0,
        result: {},
        message: 'ท่านมีสิทธิ์สมัครสอบแล้ว <br> You Have The Right To Apply For The Exam.',
        cause: 'หากต้องการสมัครสอบ สามารถไปที่เมนู [สมัครสอบ] <br><b>You have the right to apply for the exam.</b><br>If you want to apply for the exam, go to menu “Apply for the exam”',
      });
    }
    await new UpdateMemberService().addRequest(registerData);
    console.log('insert request success');
    res.status(200).send({
      status: 'success',
      code: 1,
      result: {},
      message: '-',
      cause: '-',
    });
  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    if (error.errno === 1062) {
      console.log('CustomerID duplicate');
      res.status(400).send({
        status: 'error',
        code: 1062,
        result: {},
        message: 'เลขประจำตัวประชาชนของท่านถูกใช้ในการยื่นตรวจสอบสิทธิแล้ว <br> Your ID Card Number Has Been Used To Submit Your Request.',
        cause: '',
      });
      return;
    }
    next(error);
  }
};
