import { pool } from '../database.js';
import { redis1 } from '../redis.js';

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

  async getSeatCustomer() {
    const sql = `SELECT 
                  DateExp,
                  RoundID,
                  LocationID,
                  COUNT( ID ) AS seatCount 
                FROM
                  customer 
                WHERE
                  PayStatus = '*' 
                  AND DateExp = DATE (NOW()) 
                  AND RoundID IS NOT NULL 
                  AND LocationID IS NOT NULL
                GROUP BY RoundID, LocationID`;
    const [result] = await pool.query(sql);
    return result;
  }

    async updateSeatRedis(data) {
    const keyValuePairs = {};
    for (let i = 0; i < data.length; i++) {
      const keySeatCount = `SeatCount_R${data[i].RoundID}_L${data[i].LocationID}`;
      const seatCountRedis = await redis1.get(keySeatCount);
      const values = seatCountRedis - data[i].seatCount;
      keyValuePairs[keySeatCount] = values;
    }
    const updateRedis = await redis1.mset(keyValuePairs);
    return updateRedis;
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
