const express = require("express");
const DB = require("./helpers/db");
const Mapping = require("./helpers/mapping");
const { createInvoiceType1 } = require("./helpers/invoice-image");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/image", async (req, res) => {
  try {
    const { width, orderId, userType } = req.body;

    const invoiceDetail = await DB.getInvoiceDetail(orderId);
    if (invoiceDetail.length === 0) {
      res.status(422).json({ error: "orderId not exist" });
    }
    const userId = invoiceDetail[0].user_id;
    const [employee, bank] = await Promise.all([
      DB.getInfoEmployee(userId, userType),
      DB.getBankInfo(userId, userType),
    ]);

    const mapped = await Mapping.getInvoice(invoiceDetail, employee, bank);
    const invoiceImage = await createInvoiceType1(mapped, width);
    const base64 = `data:image/png;base64,${invoiceImage.toString("base64")}`;
    res.status(200).send(base64);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong.", cause: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
