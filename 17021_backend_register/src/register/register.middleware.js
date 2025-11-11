const checkTimeOpen = (req, res, next) => {
  const now = new Date();

  const registerOpenDate = new Date(2025, 8, 9, 8, 30, 0); //วันเปิดรับสมัคร

  if (now < registerOpenDate) {
    res.status(200).send({
      status: 'error',
      code: 2,
      result: {},
      message: 'ระบบยังไม่เปิดรับสมัคร <br> The system is not available',
      cause: '',
    });
    return;
  }

  next();
};

const checkTimeEnd = (req, res, next) => {
  const now = new Date();

  const registerEndDate = new Date(2025, 8, 19, 16, 30, 0); //วันปิดรับสมัคร

  if (now > registerEndDate) {
    res.status(200).send({
      status: 'error',
      code: 2,
      result: {},
      message: 'ระบบปิดรับสมัครแล้ว <br> The system is not available',
      cause: '',
    });
    return;
  }

  next();
};

export { checkTimeOpen, checkTimeEnd };
