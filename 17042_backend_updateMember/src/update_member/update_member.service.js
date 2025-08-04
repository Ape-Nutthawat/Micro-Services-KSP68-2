import mariadb from 'mariadb';
import { pool } from '../database.js';

export default class UpdateMemberService {
  /**
   * @type { import('mariadb').Pool }
   */

  async checkMember(CustomerID) {
    const sqlCheckMember = `SELECT CustomerID, BirthDMY, Name1, Name2, Name3, Name1EN, Name2EN, NameMidEN, Name3EN, TelMobile, Email FROM member WHERE CustomerID = ? ORDER BY ID DESC LIMIT 1`;
    const [member] = await pool.query(sqlCheckMember, CustomerID);
    await pool.query(`INSERT INTO check_member_log (CustomerID) VALUES ('${CustomerID}')`);
    if (member.length === 0) {
      return false;
    }
    return member;
  }

  async checkRequest(customerID) {
    const sqlRequest = `SELECT * FROM request WHERE CustomerID = ? LIMIT 1`;
    const [[request]] = await pool.query(sqlRequest, [customerID]);
    return request || false; 
}

  async checkLog(CustomerID) {
    const sqlCheckLog = `SELECT ID FROM update_member_log WHERE CustomerID = ? LIMIT 1`;
    const [customer] = await pool.query(sqlCheckLog, CustomerID);
    if (customer.length === 0) {
      return true;
    }
    return false;
  }

  async insertLogUpdateMember(body, oldData) {
    const newData = {
      BirthDMY: oldData[0].BirthDMY === body.BirthDMY ? '-' : body.BirthDMY,
      Name1: oldData[0].Name1 === body.Name1 ? '-' : body.Name1,
      Name2: oldData[0].Name2 === body.Name2 ? '-' : body.Name2,
      Name3: oldData[0].Name3 === body.Name3 ? '-' : body.Name3,
      Name1EN: oldData[0].Name1EN === body.Name1EN ? '-' : body.Name1EN,
      Name2EN: oldData[0].Name2EN === body.Name2EN ? '-' : body.Name2EN,
      NameMidEN: oldData[0].NameMidEN === body.NameMidEN ? '-' : body.NameMidEN,
      Name3EN: oldData[0].Name3EN === body.Name3EN ? '-' : body.Name3EN,
      TelMobile: oldData[0].TelMobile === body.TelMobile ? '-' : body.TelMobile,
      Email: oldData[0].Email === body.Email ? '-' : body.Email,
    };

    const sqlInsertLogUpdateMember = `INSERT INTO update_member_log SET 
    CustomerID = ?,
    BirthDMYOld = ?,
    BirthDMYNew = ?,
    Name1Old = ?,
    Name1New = ?,
    Name2Old = ?,
    Name2New = ?,
    Name3Old = ?,
    Name3New = ?,
    Name1ENOld = ?,
    Name1ENNew = ?,
    Name2ENOld = ?,
    Name2ENNew = ?,
    NameMidENOld = ?,
    NameMidENNew = ?,
    Name3ENOld = ?,
    Name3ENNew = ?,
    TelMobileOld = ?,
    TelMobileNew = ?,
    EmailOld = ?,
    EmailNew = ?`;

    const [updateMember] = await pool.query(sqlInsertLogUpdateMember, [
      body.CustomerID,
      oldData[0].BirthDMY,
      newData.BirthDMY,
      oldData[0].Name1,
      newData.Name1,
      oldData[0].Name2,
      newData.Name2,
      oldData[0].Name3,
      newData.Name3,
      oldData[0].Name1EN,
      newData.Name1EN,
      oldData[0].Name2EN,
      newData.Name2EN,
      oldData[0].NameMidEN,
      newData.NameMidEN,
      oldData[0].Name3EN,
      newData.Name3EN,
      oldData[0].TelMobile,
      newData.TelMobile,
      oldData[0].Email,
      newData.Email,
    ]);
    return updateMember;
  }

  async updateMember(body) {
    const sqlUpdate = `UPDATE member SET
                          Name1 = ?,
                          Name2 = ?,
                          Name3 = ?,
                          Name1EN = ?,
                          Name2EN = ?,
                          NameMidEN = ?,
                          Name3EN = ?,
                          BirthDMY = ?,
                          TelMobile = ?,
                          Email = ?
                        WHERE CustomerID = ?`;

    const [result] = await pool.query(sqlUpdate, [
      body.Name1,
      body.Name2,
      body.Name3,
      body.Name1EN,
      body.Name2EN,
      body.NameMidEN,
      body.Name3EN,
      body.BirthDMY,
      body.TelMobile,
      body.Email,
      body.CustomerID,
    ]);
    return result;
  }

  async getCheckAdd(customerID) {
    const sql = `SELECT ID FROM member WHERE CustomerID = ? LIMIT 1`;
    const [[member]] = await pool.query(sql, customerID);
    return member;
  }

  async addRequest(requestData) {
    const sql = `INSERT INTO request SET 
                      CustomerID = ?, 
                      StudentID = ?,
                      Name1 = ?, 
                      Name2 = ?,
                      Name3 = ?, 
                      Name1EN = ?, 
                      Name2EN = ?, 
                      NameMidEN = ?, 
                      Name3EN = ?, 
                      University = ?, 
                      Degree = ?, 
                      Major = ?, 
                      StatusStudy = ?,
                      DateIn = ?,
                      Grade = ?,
                      Address = ?, 
                      Soi = ?, 
                      Road = ?, 
                      District = ?, 
                      Amphur = ?, 
                      Province = ?, 
                      Zipcode = ?, 
                      Email = ?, 
                      TelMobile = ?,
                      StatusApprove = ?, 
                      IP = ?`;

    await pool.query(sql, [
      requestData.CustomerID,
      requestData.StudentID,
      requestData.Name1,
      requestData.Name2,
      requestData.Name3,
      requestData.Name1EN,
      requestData.Name2EN,
      requestData.NameMidEN,
      requestData.Name3EN,
      requestData.University,
      requestData.Degree,
      requestData.Major,
      requestData.StatusStudy,
      requestData.DateIn,
      requestData.Grade,
      requestData.Address,
      requestData.Soi,
      requestData.Road,
      requestData.District,
      requestData.Amphur,
      requestData.Province,
      requestData.Zipcode,
      requestData.Email,
      requestData.TelMobile,
      2,
      requestData.IP,
    ]);
  }
}
