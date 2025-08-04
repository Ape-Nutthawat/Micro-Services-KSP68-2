
const checkTimeOpen = (req, res, next) => {
  const now = new Date();

  const registerOpenDate = new Date(2024, 0, 22, 8, 30, 0); //วันเปิดรับสมัคร

  if (now < registerOpenDate) {
    res.status(200).send({
      status: 'error',
      code: 2,
      result: {},
      message: 'ไม่สามารถใช้งานระบบได้',
      cause: 'ระบบยังไม่เปิดให้ยื่นคำร้อง',
    });
    return;
  }

  next();
};

const checkTimeEnd = (req, res, next) => {
  const now = new Date();

  const registerEndDate = new Date(2025, 4, 23, 16, 29, 59); //วันปิดรับสมัคร

  if (now > registerEndDate) {
    res.status(200).send({
      status: 'error',
      code: 2,
      result: {},
      message: 'ไม่สามารถใช้งานระบบได้',
      cause: 'ระบบยื่นคำร้องปิดแล้ว',
    });
    return;
  }

  next();
};

const checkTimeEndUpdate = (req, res, next) => {
  const now = new Date();

  const registerEndDate = new Date(2024, 2, 19, 23, 59, 59); //วันปิดรับสมัคร

  if (now > registerEndDate) {
    res.status(200).send({
      status: 'error',
      code: 2,
      result: {},
      message: 'ไม่สามารถใช้งานระบบได้',
      cause: 'ระบบแก้ไขคำร้องขอคืนเงินปิดแล้ว',
    });
    return;
  }

  next();
};

export { checkTimeOpen, checkTimeEnd, checkTimeEndUpdate };
