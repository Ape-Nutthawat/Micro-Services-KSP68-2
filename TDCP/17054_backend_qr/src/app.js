import express from 'express';
import cors from 'cors';
import axios from 'axios';
import config from './config.js';
import ErrorLogRepository from './error-log.repository.js';
// import { pool } from './database.js';
import { validateToken } from './authtoken.js';
import { redis4 } from './redis.js';

const app = express();
const { port, env } = config.app;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors({ origin: ['http://localhost:3001','http://localhost:3000', 'https://uat-kspsubjects2568.thaijobjob.com','https://kspsubjects2568.thaijobjob.com', 'https://kspsubjects2568.inet.co.th'] }));

// const insertLogGenQr = async (cusId, data) => {
//   const setRedis = await redis4
//     .multi()
//     .set(cusId, JSON.stringify(data))
//     .expire(cusId, 30)
//     // .expire(cusId, 2 * 60)
//     .exec();

//   return setRedis;
// };

const insertLogGenQr = async (cusId, data) => {
  try {
    if (!cusId || !data) {
      throw new Error('Invalid input: cusId and data are required.');
    }

    // ใช้ set() และ expire() แยกกัน
    const setResult = await redis4.set(cusId, JSON.stringify(data));
    if (setResult !== 'OK') {
      throw new Error('Failed to set data in Redis');
    }

    // กำหนดเวลาให้คีย์หมดอายุ
    const expireResult = await redis4.expire(cusId, 60*30);
    if (expireResult !== 1) {
      throw new Error('Failed to set expiration in Redis');
    }

    return true;
  } catch (error) {
    console.error('Redis Error:', error);
    return null;
  }
};

app.post('/api/v2/pay/qr/uat', validateToken, async (req, res, next) => {
  const orderId = req.body.RefNo1;
  const amount = req.body.Amount;
  const desc = req.body.OrderDesc;
  const RID = desc.split('_')[0];
  const LID = desc.split('_')[1];
  const cusId = desc.split('_')[2];

  if (cusId.length !== 13) {
    return res.status(400).send({
      status: 'fail',
      message: 'เกิดข้อผิดพลาด',
    });
  }

  // console.log(parseInt(amount));
  if (parseInt(amount) != 545 && parseInt(amount) != 1045) {
    return res.status(400).send({
      status: 'fail',
      message: 'ราคาไม่ถูกต้อง',
    });
  }

  try {
    const keyExists = await redis4.exists(cusId);
    // console.log(' 😎 ~ genQr ~ keyExists : ', keyExists);
    if (keyExists) {
      const data = await redis4.get(cusId);
      const result = JSON.parse(data);
      return res.status(200).send({
        status: 'fail',
        message: 'มีการสร้าง QR Code ไปแล้ว',
        result,
      });
    }

    const data = {
      RoundID: +RID,
      LocationID: +LID,
      DateTime: new Date(),
    };

    // const payload = {
    //   orderId,
    //   key: config.tdcpKey,
    // };

    const oauthToken = await axios.post(config.tdcp.uat.tdcpOauthUrl, {
      orderId,
      key: config.tdcp.uat.tdcpKey,
    });

    const token = oauthToken.data.data.token;
    // if (oauthToken.data.code === 201) {

    const body = {
      key: config.tdcp.uat.tdcpKey,
      orderId,
      orderDesc: desc,
      amount,
      apUrl: 'http://www.irecruit.co.th/',
      lang: 'T',
      bankNo: 'SCB',
      currCode: '764',
      payType: 'QR',
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const thaiNewSCB = await axios.post(config.tdcp.uat.tdcpUrlScb, body, { headers });

    const { accessToken, link, ref1, ref2 } = thaiNewSCB.data.data;

    const results = await axios.post(link, { accessToken: accessToken });
    const qr = results.data.data.qrCode;

    await insertLogGenQr(cusId, data);

    const getRedis = await redis4.get(cusId);
    const dataRedis = JSON.parse(getRedis);

    res.status(200).send({
      status: 'success',
      code: 1,
      result: {
        amount,
        desc,
        orderId,
        ref1,
        ref2,
        qrCode: qr,
        DateTime: dataRedis.DateTime,
      },
      message: '-',
      cause: '-',
    });
    // }
  } catch (error) {
    await new ErrorLogRepository().saveErrorLog(error, req);
    if (axios.isAxiosError(error)) {
      console.log('tdcp error', {
        response: error.response,
        data: error.config,
      });
    }
    next(error);
  }
});

app.post('/api/v2/pay/qr', validateToken, async (req, res, next) => {
  const orderId = req.body.RefNo1;
  const amount = req.body.Amount;
  const desc = req.body.OrderDesc;
  const RID = desc.split('_')[0];
  const LID = desc.split('_')[1];
  const cusId = desc.split('_')[2];
  if (cusId.length !== 13) {
    return res.status(400).send({
      status: 'fail',
      message: 'เกิดข้อผิดพลาด',
    });
  }

  // console.log(parseInt(amount));
  if (parseInt(amount) != 545 && parseInt(amount) != 1045) {
    return res.status(400).send({
      status: 'fail',
      message: 'ราคาไม่ถูกต้อง',
    });
  }

  try {
    const keyExists = await redis4.exists(cusId);
    // console.log(' 😎 ~ genQr ~ keyExists : ', keyExists);
    if (keyExists) {
      const data = await redis4.get(cusId);
      const result = JSON.parse(data);
      return res.status(200).send({
        status: 'fail',
        message: 'มีการสร้าง QR Code ไปแล้ว',
        result,
      });
    }

    const data = {
      RoundID: +RID,
      LocationID: +LID,
      DateTime: new Date(),
    };

    const oauthToken = await axios.post(config.tdcp.prd.tdcpOauthUrl, {
      orderId,
      key: config.tdcp.prd.tdcpKey,
    });

    const token = oauthToken.data.data.token;
    // if (oauthToken.data.status === 201) {

    const body = {
      key: config.tdcp.prd.tdcpKey,
      orderId,
      orderDesc: desc,
      amount,
      apUrl: 'http://www.irecruit.co.th/',
      lang: 'T',
      bankNo: 'BAY',
      currCode: '764',
      payType: 'QR',
    };
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const thaiNewSCB = await axios.post(config.tdcp.prd.tdcpUrlScb, body, { headers });

    const { accessToken, link, ref1, ref2 } = thaiNewSCB.data.data;

    const results = await axios.post(link, { accessToken: accessToken });
    const qr = results.data.data.qrCode;
    await insertLogGenQr(cusId, data);

    const getRedis = await redis4.get(cusId);
    const dataRedis = JSON.parse(getRedis);

    res.status(200).send({
      status: 'success',
      code: 1,
      result: {
        amount,
        desc,
        orderId,
        ref1,
        ref2,
        qrCode: qr,
        DateTime: dataRedis.DateTime,
      },
      message: '-',
      cause: '-',
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v2/pay/qr2', validateToken, async (req, res, next) => {
  const orderId = req.body.RefNo1;
  const amount = req.body.Amount;
  const desc = req.body.OrderDesc;
  const cusId = desc.split('_')[2];
  if (cusId.length !== 13) {
    return res.status(400).send({
      status: 'fail',
      message: 'เกิดข้อผิดพลาด',
    });
  }

  if (parseInt(amount) != 545 && parseInt(amount) != 1045) {
    return res.status(400).send({
      status: 'fail',
      message: 'ราคาไม่ถูกต้อง',
    });
  }

  try {

    const oauthToken = await axios.post(config.tdcp.prd.tdcpOauthUrl, {
      orderId,
      key: config.tdcp.prd.tdcpKey,
    });

    const token = oauthToken.data.data.token;

    const body = {
      key: config.tdcp.prd.tdcpKey,
      orderId,
      orderDesc: desc,
      amount,
      apUrl: 'http://www.irecruit.co.th/',
      lang: 'T',
      bankNo: 'BAY',
      currCode: '764',
      payType: 'QR',
    };
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const thaiNewSCB = await axios.post(config.tdcp.prd.tdcpUrlScb, body, { headers });

    const { accessToken, link, ref1, ref2 } = thaiNewSCB.data.data;

    const results = await axios.post(link, { accessToken: accessToken });
    const qr = results.data.data.qrCode;

    res.status(200).send({
      status: 'success',
      code: 1,
      result: {
        amount,
        desc,
        orderId,
        ref1,
        ref2,
        qrCode: qr,
        DateTime: new Date(),
      },
      message: '-',
      cause: '-',
    });
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`[KSP payment gateway qr generator service] running on ${env} env and using port ${port}`);
});
