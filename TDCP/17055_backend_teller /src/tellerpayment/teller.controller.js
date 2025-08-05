import pool from '../database.js';
import axios from 'axios';
import config from '../config.js';
import ErrorLogRepository from '../error-log.repository.js';

export const addTeller = async (req, res) => {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

    const body = {
      key: config.tdcpKey,
      start_date: '20250716',
      end_date : '20250725',
      status: 'Success',
    };
    console.log(" 😎 ~ addTeller ~ body : ", body)

    // const body = {
    //   Key: config.tdcpKey,
    //   Status: 'Success',
    //   StartDate: yesterday,
    //   EndDate: yesterday,
    // };

    const results = await axios.post('https://new-ops.inet.co.th/portal/api/v1/payment-transactions/inquiry-txn', body);
    console.log(' 😎 ~ addTeller ~ dataTeller : ', results.data.length);
    if (results.data?.status !== 'fail') {
      let dataTeller = results.data;
      const mapData = [];
      const refs = [];
      const customerIds = [];

      for (let index = 0; index < dataTeller.length; index++) {
        let transfer_date;
        const [hour, minute, second] = [0, 2, 4].map((start) => parseInt(dataTeller[index].transaction_time.substring(start, start + 2), 10));

        const transactionTime = new Date();
        transactionTime.setHours(hour, minute, second);
        transactionTime.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' });

        const comparisonTime = new Date();
        comparisonTime.setHours(20, 0, 0);
        comparisonTime.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' });

        const transaction_date = dataTeller[index].transaction_date;
        const date = new Date(`${transaction_date.slice(0, 4)}-${transaction_date.slice(4, 6)}-${transaction_date.slice(6, 8)}`);

        if (transactionTime > comparisonTime) {
          transfer_date = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate() + 1).toString().padStart(2, '0')}`;
          // console.log('เวลา มากกว่า 20:00:00');
        } else {
          transfer_date = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          // console.log('เวลา ไม่มากกว่า 20:00:00');
        }
        mapData.push([
          dataTeller[index].payment_transaction_no,
          dataTeller[index].merchant_id,
          dataTeller[index].transaction_date,
          dataTeller[index].transaction_time,
          dataTeller[index].order_id,
          dataTeller[index].amount,
          dataTeller[index].order_desc,
          dataTeller[index].pay_type,
          dataTeller[index].bank_no,
          dataTeller[index].payment_status,
          transfer_date,
        ]);

        refs.push(dataTeller[index].order_id);

        customerIds.push(dataTeller[index].order_desc.split('_')[1]);
      }
      // console.log(" 😎 ~ addTeller ~ mapData : ", mapData)
      // console.log(' 😎 ~ addTeller ~ refs : ', refs);
      // console.log(' 😎 ~ addTeller ~ customerIds : ', customerIds);
      // const sql = `INSERT INTO teller (
      //       transaction_date,
      //       transaction_time,
      //       order_id,
      //       payment_reference_id,
      //       receive_amount,
      //       order_description,
      //       payment_type,
      //       payment_acquirer_bank,
      //       response_message,
      //       void_flag,
      //       transfer_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    //   {
    //     "payment_transaction_no": "P01293017591608",
    //     "merchant_id": "M25012700008",
    //     "transaction_date": "20250129",
    //     "transaction_time": "133417",
    //     "order_id": "100000003",
    //     "amount": 1,
    //     "order_desc": "1_1849801196263_99990_testirc2025",
    //     "pay_type": "QR Code Payment",
    //     "bank_no": "SCB",
    //     "payment_status": "Success"
    // }
      const sql = `INSERT INTO teller (
                    payment_transaction_no,
                    merchant_id,
                    transaction_date,
                    transaction_time,
                    order_id,
                    amount,
                    order_desc,
                    pay_type,
                    bank_no,
                    payment_status,
                    transfer_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

      const updateSql = `UPDATE customer SET PayStatus = '' WHERE RefNo1 IN (?) AND CustomerID IN (?)`;

      const insertResults = await pool.batch(sql, mapData);

      const update = await pool.query(updateSql, [refs, customerIds]);
      console.log(' 😎 ~ addTeller ~ update : ', update);

      // return res.send(insertResults);
      return res.status(200).send({
        status: 'success',
        insertResults,
        update,
      });
    } else {
      return res.status(400).send({
        status: 'fail',
        message: 'เกิดข้อผิดพลาด',
      });
    }
  } catch (error) {
    // await new ErrorLogRepository().saveErrorLog(error, req);
    res.status(500).send({
      status: 'error',
      code: 0,
      error,
      message: 'internal error',
      cause: 'unknown',
    });
  }
};
