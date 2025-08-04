import { pool } from '../database.js';

export default class RefundService {
  async checkPermissionRefund(CustomerID) {
    const sql = `SELECT CustomerID FROM request_refund WHERE CustomerID = ?`;
    const [refund] = await pool.query(sql, CustomerID);
    return refund;
  }

  async checkRefund(CustomerID) {
    const sql = `SELECT * FROM request_refund WHERE CustomerID = ?`;
    const [customer] = await pool.query(sql, CustomerID);
    return customer;
  }

  async searchCustomer(CustomerID, BirthDMY) {
    const sqlCustomer = `SELECT 
                          PayStatus,
                          CustomerID,
                          Name1,
                          Name2,
                          Name3,
                          Name1EN,
                          Name2EN,
                          NameMidEN,
                          Name3EN
                        FROM vCustomerRefund
                        WHERE
                            CustomerID = ?
                            AND BirthDMY = ?`;

    const [customer] = await pool.query(sqlCustomer, [CustomerID, BirthDMY]);
    return customer;
  }

  async checkCustomer(CustomerID) {
    const sqlCustomer = `SELECT 
                          CustomerID,
                          Name1,
                          Name2,
                          Name3,
                          Name1EN,
                          Name2EN,
                          NameMidEN,
                          Name3EN
                        FROM vCustomerRefund
                        WHERE
                            CustomerID = ?`;

    const [customer] = await pool.query(sqlCustomer, [CustomerID]);
    return customer;
  }

  async insertRequestRefund(CustomerID, Name1, Name2, Name3, Email, Tel, BankName, AccountName, AccountNo, FileBookBank, FileEvidence, IP) {
    const sql = `INSERT INTO 
                  request_refund 
                SET 
                  CustomerID = ?, 
                  Name1 = ?, 
                  Name2 = ?, 
                  Name3 = ?, 
                  Email = ?, 
                  Tel = ?, 
                  BankName = ?,
                  AccountName = ?,
                  AccountNo = ?,
                  FileBookBank = ?,
                  FileEvidence = ?,
                  IP = ?`;

    await pool.query(sql, [CustomerID, Name1, Name2, Name3, Email, Tel, BankName, AccountName, AccountNo, FileBookBank, FileEvidence, IP]);
  }
}