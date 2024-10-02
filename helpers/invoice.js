const { createCanvas } = require("canvas");

function createInvoiceImage() {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background color for the invoice
  ctx.fillStyle = "#ffffff"; // White background
  ctx.fillRect(0, 0, width, height);

  // Add Invoice Header
  ctx.font = "30px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText("Invoice", 50, 50);

  // Add company details
  ctx.font = "20px Arial";
  ctx.fillText("Company Name", 50, 100);
  ctx.fillText("Address: 1234 Street", 50, 130);
  ctx.fillText("Date: 2024-10-02", 50, 160);

  // Add table headers
  ctx.font = "18px Arial";
  ctx.fillText("Item", 50, 220);
  ctx.fillText("Qty", 300, 220);
  ctx.fillText("Price", 400, 220);
  ctx.fillText("Total", 500, 220);

  // Add table contents (sample)
  ctx.fillText("Product A", 50, 260);
  ctx.fillText("2", 300, 260);
  ctx.fillText("$50", 400, 260);
  ctx.fillText("$100", 500, 260);

  ctx.fillText("Product B", 50, 300);
  ctx.fillText("1", 300, 300);
  ctx.fillText("$75", 400, 300);
  ctx.fillText("$75", 500, 300);

  // Add total price
  ctx.fillText("Total: $175", 500, 360);

  // Save the image as PNG
  const buffer = canvas.toBuffer("image/png");
  return buffer;
}

module.exports = {
  createInvoiceImage,
};
