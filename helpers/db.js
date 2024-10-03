const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const {SvgBuilder} = require("./helper");


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
      "SELECT " +
        "od.id, " +
        "od.user_id, " +
        "od.type as order_type, " +
        "users.name as employee, " +
        "users.phone as employeePhone, " +
        "od.name as customerPhone, " +
        "od.phone as customer, " +
        "od.code as invoiceNumber, " +
        "od.updated_at as invoiceDate, " +
        "od.retail_cost as total, " +
        "od.service_fee as service_fee, " +
        "od.discount as discount, " +
        "od.discount_type as discount_type, " +
        "order_detail.quantity as quantity, " +
        "order_detail.user_cost as user_cost, " +
        "order_detail.retail_cost as retail_cost_detail, " +
        "order_detail.base_cost as base_cost_detail, " +
        "variant.name as variant_name, " +
        "order_detail.variant_id as variant_id, " +
        "(select sum(price) from order_payment where order_payment.order_id = od.id) as order_payment_price, " +
        "(select sum(price) from order_service_fee where order_service_fee.order_id = od.id) as order_service_fee " +
        "FROM \`order\` as od" +
      " LEFT JOIN order_detail on od.id = order_detail.order_id" +
      " LEFT JOIN variant on order_detail.variant_id = variant.id" +
      " LEFT JOIN users on od.user_id = users.id" +
      " where od.id = ?",
      [orderId],
    );
    return rows;
  } finally {
    connection.release();
  }
}

async function getInfoEmployee(userId, userType) {
  // TODO: load invoice detail from database
  const connection = await pool.getConnection();
  try {
    // if (userType === 2) {
      const [rows] = await connection.query(
          "SELECT * FROM \`config\` WHERE user_id = ? limit 1",
          [userId],
      );

    return rows;
  } finally {
    connection.release();
  }
}

async function getInfoGetQr(userId, userType, total, orderCode) {
  // TODO: load invoice detail from database
  const connection = await pool.getConnection();
  try {
    // if (userType === 2) {
      const [rows] = await connection.query(
          "SELECT * FROM \`account_bank\` WHERE user_id = ? limit 1",
          [userId],
      );

      if (rows.length > 0) {
        console.log(rows);
        console.log(process.env.API_QR + "/generate-qr");
        const response = await fetch(process.env.API_QR + "/generate-qr", {
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          method: "POST",
          body: {
            acq_id: rows[0].acq_id,
            account_no: rows[0].account_no,
            total: total,
            description: "TT don hang " + orderCode
          }
        });
        console.log(response.body);
      }

    // }
    return rows;
  } finally {
    connection.release();
  }
}


module.exports = {
  getInvoiceDetail,
  getInfoEmployee,
  getInfoGetQr,
};
