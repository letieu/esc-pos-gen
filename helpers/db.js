const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getInvoiceDetail(orderId) {
  // TODO: load invoice detail from database
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM \`order\` WHERE id = ?",
      [orderId],
    );
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  getInvoiceDetail,
};
