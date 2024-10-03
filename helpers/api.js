const Sharp = require("sharp");

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
  const svgBuffer = Buffer.from(svgString);
  const image = await Sharp(svgBuffer).png().toBuffer();
  return image.toString("base64");
}

getBankQr("1", "123456789", 100000, "123456").then((data) => {
  console.log(data);
});

module.exports = {
  getBankQr,
};
