const Sharp = require("sharp");
const { SvgBuilder, formatDate, numberFormat } = require("./helper");

/**
 * @typedef {Object} InvoiceItem
 *  @property {string} name - Tên mặt hàng.
 *  @property {number} price - Đơn giá.
 *  @property {number} quantity - Số lượng.
 *  @property {number} total - Tổng tiền.
 *  @property {number} userCost - Gía bán / nhập.
 *  @property {number} retailCost - Gía bán.
 *  @property {number} baseCost - Gía nhập.
 */

/**
 * @typedef {Object} Invoice
 * @property {string} employee - Thu ngân.
 * @property {string} employeePhone - Số điện thoại của thu ngân.
 * @property {string} invoiceNumber - Số hóa đơn.
 * @property {Date} invoiceDate - Ngày bán. // TODO: Use hour and date
 * @property {string} customer - Tên khách hàng.
 * @property {string} customerPhone - Số điện thoại của khách hàng.
 * @property {number} total - Tổng tiền hóa đơn.
 * @property {number} discount - Giảm giá (%/đ)
 * @property {number} discountType - Loại giảm giá
 * @property {number} orderPaymentPrice - Tổng tiền thanh toán.
 * @property {number} totalDebt - Tổng tiền nợ.
 * @property {string} companyPhone - Số điện thoại của cửa hàng.
 * @property {string} companyAddress - Địa chỉ của cửa hàng.
 * @property {string} companyWebsite - Website của cửa hàng.
 * @porperty {string} bankAccount - Số tài khoản ngân hàng.
 * @property {string} bankName - Tên ngân hàng.
 * @property {string} bankOwner - Chủ tài khoản.
 * @property {string} bankQr - QR code của tài khoản ngân hàng.
 * @property {string} logo - Logo của cửa hàng.
 * @property {InvoiceItem[]} items - Danh sách các mặt hàng trong hóa đơn.
 */

/**
 * Creates an image of an invoice with the specified width.
 *
 * @param {Invoice} invoice - The invoice data.
 * @param {number} width - The width of the invoice image to be created.
 * @returns {Promise<Buffer>} - The svg string of the invoice image.
 */
async function createInvoiceType1(invoice, width) {
  const alignLeft = width * 0.02;
  const alignRight = width * 0.98;

  //const svgBuilder = new SvgBuilder(width, "Arial, sans-serif");
  const svgBuilder = new SvgBuilder(width, "Times New Roman");

  const logoWidth = width * 0.2;
  const logoHeight = logoWidth;
  const logoX = width / 2 - logoWidth / 2;
  if (invoice.logo) {

    svgBuilder.addLine(
      (y) =>
        `<image x="${logoX}" y="${y}" width="${logoWidth}" height="${logoHeight}" href="data:image/png;base64,${invoice.logo}" />`,
    );
    svgBuilder.addLine((y) => `<line x="0" y="${y}"></line>`);
    svgBuilder.addLine((y) => `<line x="0" y="${y}"></line>`);
    svgBuilder.addLine((y) => `<line x="0" y="${y}"></line>`);
    svgBuilder.addLine((y) => `<line x="0" y="${y}"></line>`);
    svgBuilder.addLine((y) => `<line x="0" y="${y}"></line>`);
  }

  svgBuilder
    .addLine(
        (y) =>
            `<image x="${logoX}" y="${y}" width="${logoWidth}" height="${logoHeight}" href="data:image/png;base64,${invoice.bankQr}" />`,
    )
    .addLine((y) => `<line x="0" y="${y}"></line>`)
    .addLine((y) => `<line x="0" y="${y}"></line>`)
    .addLine((y) => `<line x="0" y="${y}"></line>`)
    .addLine((y) => `<line x="0" y="${y}"></line>`)
    .addLine((y) => `<line x="0" y="${y}"></line>`)
    .addLine(
      (y) =>
        `<text x="50%" y="${y}" text-anchor="middle" font-size="16" font-weight="bold">Hóa đơn bán hàng</text>`,
    )
    .addLine(
      (y) =>
        `<text x="50%" y="${y}" text-anchor="middle" font-size="12"></text>`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12"><tspan font-weight="bold">Thu Ngân</tspan>: ${invoice.employee}</text>
         <text x="${width * 0.55}" y="${y}" font-size="12"><tspan font-weight="bold">Thời gian</tspan>: ${formatDate(invoice.invoiceDate)}</text>`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12"><tspan font-weight="bold">SĐT</tspan>: ${invoice.employeePhone}</text>
         <text x="${width * 0.55}" y="${y}" font-size="12"><tspan font-weight="bold">Khách</tspan>: ${invoice.customer}</text>`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12"><tspan font-weight="bold">No</tspan>: ${invoice.invoiceNumber}</text>
         <text x="${width * 0.55}" y="${y}" font-size="12"><tspan font-weight="bold">SĐT</tspan>: ${invoice.customerPhone}</text>`,
    )
    .addLine(
      (y) =>
        `<line x1="${alignLeft}" y1="${y}" x2="${alignRight}" y2="${y}" stroke="black" stroke-dasharray="5,5" />`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="14">Mặt hàng</text>
         <text x="${width * 0.5}" y="${y}" font-size="14">Đơn giá</text>
         <text x="${width * 0.7}" y="${y}" font-size="14">Sl</text>
         <text x="${alignRight}" y="${y}" font-size="14" text-anchor="end">T.Tiền</text>`,
    );

  invoice.items.forEach((item, index) => {
    if (item.name.length > 20) {
      svgBuilder.addLine(
        (y) =>
          `<text x="${alignLeft}" y="${y}" font-size="12">${item.name.slice(0, 20)}</text>`,
      );
      svgBuilder.addLine(
        (y) =>
          `<text x="${alignLeft}" y="${y}" font-size="12">${item.name.slice(20)}</text>
        <text x="${width * 0.5}" y="${y}" font-size="12">${numberFormat(item.userCost)}</text>
        <text x="${width * 0.7}" y="${y}" font-size="12">${item.quantity}</text>
        <text x="${alignRight}" y="${y}" font-size="12" text-anchor="end">${item.orderType === 1 ? numberFormat(item.retailCost) : numberFormat(item.baseCost)}</text>`,
      );
    } else {
      svgBuilder.addLine(
        (y) =>
          `<text x="${alignLeft}" y="${y}" font-size="12">${item.name}</text>
        <text x="${width * 0.5}" y="${y}" font-size="12">${item.price}</text>
        <text x="${width * 0.7}" y="${y}" font-size="12">${item.quantity}</text>
        <text x="${alignRight}" y="${y}" font-size="12" text-anchor="end">${item.total}</text>`,
      );
    }
  });

  svgBuilder
    .addLine(
      (y) =>
        `<line x1="${alignLeft}" y1="${y}" x2="${alignRight}" y2="${y}" stroke="black" stroke-dasharray="5,5" />`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12">TỔNG GIÁ TRỊ HÓA ĐƠN</text>
         <text x="${alignRight}" y="${y}" font-size="12" text-anchor="end">${numberFormat(invoice.total)}</text>`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12">GIẢM GIÁ</text>
         <text x="${alignRight}" y="${y}" font-size="12" text-anchor="end">${invoice.discount} ${invoice.discountType === 1 ? "%" : "đ"}</text>`,
    )

    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12">ĐÃ THANH TOÁN</text>
         <text x="${alignRight}" y="${y}" font-size="12" text-anchor="end">${numberFormat(invoice.orderPaymentPrice)}</text>`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12">CÔNG NỢ</text>
         <text x="${alignRight}" y="${y}" font-size="12" text-anchor="end">${numberFormat(invoice.total - invoice.orderPaymentPrice)}</text>`,
    )
    .addLine(
      (y) =>
        `<line x1="${alignLeft}" y1="${y}" x2="${alignRight}" y2="${y}" stroke="black" stroke-dasharray="5,5" />`,
    )
    .addLine(
      (y) =>
        `<text x="${alignLeft}" y="${y}" font-size="12">Số tham chiếu</text>
         <text x="${alignRight}" y="${y}" font-size="12" text-anchor="end">${invoice.invoiceNumber}</text>`,
    )
    .addLine(
      (y) =>
        `<line x1="${alignLeft}" y1="${y}" x2="${alignRight}" y2="${y}" stroke="black" stroke-dasharray="5,5" />`,
    )
    .addLine(
      (y) =>
        `<text x="50%" y="${y}" text-anchor="middle" font-size="12">Hotline: ${invoice.companyPhone}</text>`,
    )
    .addLine(
      (y) =>
        `<text x="50%" y="${y}" text-anchor="middle" font-size="12">Website: ${invoice.companyWebsite}</text>`,
    )
    .addLine(
      (y) =>
        `<text x="50%" y="${y}" text-anchor="middle" font-size="12">${invoice.companyAddress}</text>`,
    )
    .addLine(
      (y) =>
        `<line x1="${alignLeft}" y1="${y}" x2="${alignRight}" y2="${y}" stroke="black" stroke-dasharray="5,5" />`,
    )
    .addLine(
      (y) =>
        `<text x="50%" y="${y}" text-anchor="middle" font-size="14">CẢM ƠN QUÝ KHÁCH VÀ HẸN GẶP LẠI</text>`,
    )

    .addLine(
      (y) =>
        `<text x="50%" y="${y}" text-anchor="middle" font-size="12"></text>`,
    );

  const svg = svgBuilder.getSvg();
  const image = await Sharp(Buffer.from(svg)).png().toBuffer();
  return image;
}

module.exports = {
  createInvoiceType1,
};
