import mariadb from 'mariadb';
import { pool } from '../database.js';

export default class UpdateMemberService {
  /**
   * @type { import('mariadb').Pool }
   */

  async getCustomer(CustomerID, BirthDMY) {
    const sqlCustomer = `SELECT CustomerID, BirthDMY, Name1, Name2, Name3, Name1EN, Name2EN, NameMidEN, Name3EN, Degree, DateIn, FileImg FROM customer WHERE CustomerID = ? AND BirthDMY = ?`;
    const [customerData] = await pool.query(sqlCustomer, [CustomerID, BirthDMY]);
    return customerData;
  }

  async checkLog(CustomerID) {
    const sqlCheckLog = `SELECT ID FROM update_member_log WHERE CustomerID = ? LIMIT 1`;
    const [customer] = await pool.query(sqlCheckLog, CustomerID);
    if (customer.length === 0) {
      return true;
    }
    return false;
  }


  async checkLogUpdateCustomer(CustomerID) {
    const sqlCheckLogUpdateCustomer = `SELECT isFileImg FROM update_customer_log WHERE CustomerID = ?`;
    const [logData] = await pool.query(sqlCheckLogUpdateCustomer, [CustomerID]);
    return logData;
  }

  async checkLogUpdatePhoto(CustomerID) {
    const sqlCheckLogUpdatePhoto = `SELECT ID FROM update_photo_log WHERE CustomerID = ?`;
    const [logData] = await pool.query(sqlCheckLogUpdatePhoto, [CustomerID]);
    return logData;
  }
}
