const api = require('./api');

/**
 * Creates an image of an invoice with the specified width.
 *
 * @param {Array} invoiceDetail - The invoice data.
 * @param {Object} employee - The employee data.
 * @param {string} bankQr - The bank QR code.
 * @returns {Promise<Invoice>} - The invoice data.
 */
async function getInvoice(invoiceDetail, employee, bank) {
  const invoiceData = invoiceDetail[0];

  const result = {
    id: invoiceData.id,
    user_d: invoiceData.user_id,
    orderType: invoiceData.order_type,
    employee: invoiceData.employee,
    employeePhone: invoiceData.employeePhone,
    customerPhone: invoiceData.customerPhone,
    customer: invoiceData.customer,
    total: invoiceData.total,
    invoiceNumber: invoiceData.invoiceNumber,
    invoiceDate: invoiceData.invoiceDate,
    serviceFee: invoiceData.service_fee,
    orderPaymentPrice: invoiceData.order_payment_price,
    discount: invoiceData.discount,
    discountType: invoiceData.discount_type,

    companyPhone: employee.phone,
    companyAddress: employee.address,
    companyWebsite: employee.website,
    logo: employee.logo,

    bankQr: "",
    bankAccount: bank.account_no,
    bankName: bank.name,

    items: invoiceDetail.map((item) => ({
      name: item.variant_name,
      retailCost: item.retail_cost_detail,
      baseCost: item.base_cost_detail,
      quantity: item.quantity,
      userCost: item.user_cost,
    })),
  };

  result.bankQr = await api.getBankQr(
    bank.acq_id,
    bank.account_no,
    result.total,
    result.invoiceNumber,
  );

  return result;
}

module.exports = {
  getInvoice,
};
