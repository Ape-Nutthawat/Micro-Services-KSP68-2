const checkTimeOpen1 = (req, res, next) => {
  const now = new Date();

  const registerOpenDate = new Date(2025, 8, 5, 0, 0, 0); //วันเปิดระบบตรวจสอบสิทธิและปรับปรุงข้อมูล

  if (now < registerOpenDate) {
    res.status(200).send({
      status: 'error',
      code: 0,
      result: {},
      message: 'ระบบตรวจสอบสิทธิและปรับปรุงข้อมูลยังไม่เปิด <br> The system is not available',
      cause: '',
    });
    return;
  }

  next();
};

const checkTimeOpen2 = (req, res, next) => {
  const now = new Date();

  const registerOpenDate = new Date(2025, 8, 6, 8, 30, 0); //วันเปิดระบบตรวจสอบสิทธิและปรับปรุงข้อมูล

  if (now < registerOpenDate) {
    res.status(200).send({
      status: 'error',
      code: 0,
      result: {},
      message: 'ระบบตรวจสอบสิทธิและปรับปรุงข้อมูลยังไม่เปิด <br> The system is not available',
      cause: '',
    });
    return;
  }

  next();
};

const checkTimeEnd = (req, res, next) => {
  const now = new Date();

  const registerEndDate = new Date(2025, 8, 11, 16, 30, 0); //วันปิดระบบตรวจสอบสิทธิและปรับปรุงข้อมูล

  if (now > registerEndDate) {
    res.status(200).send({
      status: 'error',
      code: 0,
      result: {},
      message: 'ระบบตรวจสอบสิทธิและปรับปรุงข้อมูลปิดแล้ว <br> The system is not available',
      cause: '',
    });
    return;
  }

  next();
};

export { checkTimeEnd, checkTimeOpen1, checkTimeOpen2 };
