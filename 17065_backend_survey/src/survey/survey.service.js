import { pool } from '../database.js';

export default class SurveyService {
  async searchCustomer(CustomerID, BirthDMY) {
    const sqlCustomer = `SELECT 
                          CustomerID,
                          Name1,
                          Name2,
                          Name3,
                          Name1EN,
                          Name2EN,
                          NameMidEN,
                          Name3EN,
                          BirthDMY
                        FROM vStatusCustomer
                        WHERE
                            CustomerID = ?
                            AND BirthDMY = ?
                        LIMIT 1`;

    const [customer] = await pool.query(sqlCustomer, [CustomerID, BirthDMY]);
    if (customer.length === 0) {
      return false;
    }
    return customer[0];
  }

  async addSurvey(CustomerID, Q1, Q2, Q3, Q4, Q5, Q6) {
    const sql = `INSERT INTO survey (CustomerID, Q1, Q2, Q3, Q4, Q5, Q6) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await pool.query(sql, [CustomerID, Q1, Q2, Q3, Q4, Q5, Q6]);
    
  } 
}
