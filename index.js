const express = require("express");
const { createInvoiceType1 } = require("./helpers/invoice-image");
const { getInvoiceDetail } = require("./helpers/db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/image", async (req, res) => {
  try {
    const { width, orderId } = req.body;
    const invoiceDetail = await getInvoiceDetail(orderId);
    const invoiceImage = await createInvoiceType1(invoiceDetail, width);
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
