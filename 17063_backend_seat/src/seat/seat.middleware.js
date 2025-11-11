const checkTimeOpen = (req, res, next) => {
  const now = new Date();

  const registerOpenDate = new Date(2025, 8, 9, 8, 30, 0); //วันเปิดรับสมัคร

  if (now < registerOpenDate) {
    res.status(200).send({
      status: 'error',
      code: 2,
      result: {},
      message: 'ระบบยังไม่เปิด <br> The system is not available',
      cause: '',
    });
    return;
  }

  next();
};

const checkTimeEnd = (req, res, next) => {
  const now = new Date();

  const registerEndDate = new Date(2025, 8, 19, 22, 0, 0); //วันปิดรับสมัคร

  if (now > registerEndDate) {
    res.status(200).send({
      status: 'error',
      code: 2,
      result: {},
      message: 'ระบบปิดแล้ว <br> The system is not available',
      cause: '',
    });
    return;
  }

  next();
};

export { checkTimeOpen, checkTimeEnd };
