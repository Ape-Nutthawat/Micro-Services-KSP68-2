import { pool } from '../database.js';

export default class SeatService {
  async updateSeatCustomer(ProvinceID, ProvinceName, CustomerID) {
    const updateQuery = `UPDATE customer SET
                                DateExp = DATE_ADD(NOW(), INTERVAL 1 DAY),
                                UpdateSeat = NOW(),
                                ProvinceID = ?,
                                ProvinceName = ?
                                WHERE CustomerID = ? 
                                AND ProvinceID IS NULL
                                AND ProvinceName IS NULL 
                                LIMIT 1`;

    const [result] = await pool.query(updateQuery, [ProvinceID, ProvinceName, CustomerID]);
    return result;
  }

  async checkSeatCustomer(CustomerID) {
    const sql = `SELECT ProvinceID, ProvinceName FROM customer WHERE CustomerID = ? \\`;
    const [result] = await pool.query(sql, [CustomerID]);
    return result;
  }

  async reloadSeatCustomer() {
    const updateSql = `UPDATE customer SET 
                        DateExp = NULL,
                        UpdateSeat = NULL,
                        ProvinceID = NULL,
                        ProvinceName = NULL 
                      WHERE DateExp = DATE(NOW())
                      AND PayStatus = "*"`;
    const [result] = await pool.query(updateSql);
    return result;
  }
}
