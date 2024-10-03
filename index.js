const express = require("express");
const { createInvoiceType1 } = require("./helpers/invoice-image");
const { getInvoiceDetail, getInfoEmployee, getInfoGetQr } = require("./helpers/db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/image", async (req, res) => {
  try {
    const { width, orderId, userType } = req.body;
    const invoiceDetail = await getInvoiceDetail(orderId);
    if (invoiceDetail.length === 0) {
      res.status(422).json({ error: "orderId not exist" });
    }
    const infoEmployee = await getInfoEmployee(invoiceDetail[0].user_id, userType);
    const infoGetQr = await getInfoGetQr(invoiceDetail[0].user_id, userType, invoiceDetail[0].total, invoiceDetail[0].invoiceNumber);

    let item = [];
    let data = {};
    data = {
        id: invoiceDetail[0].id,
        user_id: invoiceDetail[0].user_id,
        orderType: invoiceDetail[0].order_type,
        employee: invoiceDetail[0].employee,
        employeePhone: invoiceDetail[0].employeePhone,
        customerPhone: invoiceDetail[0].customerPhone,
        customer: invoiceDetail[0].customer,
        total: invoiceDetail[0].total,
        invoiceNumber: invoiceDetail[0].invoiceNumber,
        invoiceDate: invoiceDetail[0].invoiceDate,
        serviceFee: invoiceDetail[0].service_fee,
        orderPaymentPrice: invoiceDetail[0].order_payment_price,
        discount: invoiceDetail[0].discount,
        discountType: invoiceDetail[0].discount_type,
        companyPhone: infoEmployee.length > 0 ? infoEmployee[0].phone : "",
        companyAddress: infoEmployee.length > 0 ? infoEmployee[0].address : "",
        companyWebsite: infoEmployee.length > 0 ? infoEmployee[0].website : "",
        logo: infoEmployee.length > 0 ? infoEmployee[0].logo : ''
      }

    for(var i = 0; i < invoiceDetail.length;i++){
      item.push({
        name: invoiceDetail[i]['variant_name'],
        retailCost: invoiceDetail[i]['retail_cost_detail'],
        baseCost: invoiceDetail[i]['base_cost_detail'],
        quantity: invoiceDetail[i]['quantity'],
        userCost: invoiceDetail[i]['user_cost'],
      });
    }
    data['items'] = item;
    console.log(data);
    const invoiceImage = await createInvoiceType1(data, width);
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
