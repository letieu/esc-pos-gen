const dotenv = require("dotenv");
dotenv.config();

async function getBankQr(acqId, accountNo, total, orderCode) {
  const response = await fetch(process.env.API_QR + "/generate-qr", {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    method: "POST",
    body: {
      acq_id: acqId,
      account_no: accountNo,
      total: total,
      description: "TT don hang " + orderCode,
    },
  });

  const svgString = await response.text();
  const base64Data = Buffer.from(svgString).toString("base64");
  return base64Data;
}

module.exports = {
  getBankQr,
};
