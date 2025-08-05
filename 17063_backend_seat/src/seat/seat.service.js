import { pool } from '../database.js';

export default class SeatService {
  async updateSeatCustomer(RoundID, Round, LocationID, Location, CustomerID) {
    const updateQuery = `UPDATE customer SET
                                DateExp = DATE_ADD(NOW(), INTERVAL 1 DAY),
                                UpdateSeat = NOW(),
                                RoundID = ?,
                                Round = ?,
                                LocationID = ?,
                                Location = ?
                        WHERE CustomerID = ? 
                              AND RoundID IS NULL
                              AND LocationID IS NULL 
                              LIMIT 1`;

    const [result] = await pool.query(updateQuery, [RoundID, Round, LocationID, Location, CustomerID]);
    return result;
  }

  async reloadSeatCustomer() {
    const updateSql = `UPDATE customer SET 
                        DateExp = NULL,
                        UpdateSeat = NULL,
                        RoundID = NULL,
                        Round = NULL,
                        LocationID = NULL,
                        Location = NULL 
                      WHERE DateExp = DATE(NOW())
                      AND PayStatus = "*"`;
    const [result] = await pool.query(updateSql);
    return result;
  }
}
