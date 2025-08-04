import { pool } from '../database.js';
import nodemailer from 'nodemailer';
import config from '../config.js';
import { Template } from '../sendMail/Template.js';
import { TemplatePayment } from '../sendMail/TemplatePayment.js';

export default class SendMailService {
  async sendMailRegister(receiver) {
    // const smtp = {
    //   debug: false,
    //   requireTLS: true,
    //   host: 'onerelay.one.th', //set to your host name or ip
    //   secureConnection: false, // use SSL
    //   port: '25', //25, 465, 587 depend on your
    //   // secure: true, // use SSL
    //   auth: {
    //     user: 'online@inet.co.th',
    //     pass: '',
    //   },
    //   tls: {
    //     // ciphers: 'SSLv3',
    //     rejectUnauthorized: false,
    //   },
    // };

    try {
      // console.log('ทดสอบส่งเมล');
      const transporter = nodemailer.createTransport(config.smtp);
      // const mailOptions = {
      //   from: `online@inet.co.th`,
      //   to: receiver,
      //   subject: 'สำนักงานเลขาธิการคุรุสภาได้รับข้อมูลการกรอกใบสมัครสอบ กลุ่มวิชา ระบบกระดาษ ประจำปี พ.ศ. 2568 ของท่านแล้ว',
      //   html: Template(),
      // };

      const mailOptions = {
        from: `"online@inet.co.th" <no-reply@inet.co.th>`,
        to: receiver,
        subject: 'สำนักงานเลขาธิการคุรุสภาได้รับข้อมูลการกรอกใบสมัครสอบ กลุ่มวิชา ระบบกระดาษ ประจำปี พ.ศ. 2568 ของท่านแล้ว',
        html: Template(),
        replyTo: 'no-reply@inet.co.th',
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async sendMailPayment(receiver) {
    // const smtp = {
    //   debug: false,
    //   requireTLS: true,
    //   host: 'onerelay.one.th', //set to your host name or ip
    //   secureConnection: false, // use SSL
    //   port: '25', //25, 465, 587 depend on your
    //   // secure: true, // use SSL
    //   auth: {
    //     user: 'online@inet.co.th',
    //     pass: '',
    //   },
    //   tls: {
    //     // ciphers: 'SSLv3',
    //     rejectUnauthorized: false,
    //   },
    // };

    try {
      // console.log('ทดสอบส่งเมล');
      for (let i = 0; i < receiver.length; i++) {
        const transporter = nodemailer.createTransport(config.smtp);
        // const mailOptions = {
        //   from: `online@inet.co.th`,
        //   to: receiver[i],
        //   subject: 'สำนักงานเลขาธิการคุรุสภาได้รับข้อมูลยืนยันการชำระเงินค่าสมัครสอบวิชาครูครั้งที่ 1/2568 ของท่าน จากธนาคารแล้ว',
        //   html: TemplatePayment(),
        // };

          const mailOptions = {
          // from: `"สำนักงานเลขาธิการคุรุสภา" <no-reply@inet.co.th>`,
          from: `"online@inet.co.th" <no-reply@inet.co.th>`,
          to: receiver[i],
          subject: 'สำนักงานเลขาธิการคุรุสภาได้รับข้อมูลยืนยันการชำระเงินค่าสมัครสอบ กลุ่มวิชา ระบบกระดาษ ประจำปี พ.ศ. 2568 ของท่าน จากธนาคารแล้ว',
          html: TemplatePayment(),
          replyTo: 'no-reply@inet.co.th',
        };
        // console.log(mailOptions.to);
        await transporter.sendMail(mailOptions);
      }
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
