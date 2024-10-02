const Jimp = require("jimp");

function createInvoiceImage() {
  // Create a new image with white background
  const width = 384;
  const height = 600;

  const promise = new Promise((resolve, reject) => {
    new Jimp(width, height, "#FFFFFF", async (err, image) => {
      if (err) {
        reject(err);
      }

      // Load a font
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

      // Add Invoice Title
      image.print(font, 50, 50, "Invoice");

      // Add Company Information
      image.print(font, 50, 100, "Company Name");
      image.print(font, 50, 140, "Address: 1234 Street");
      image.print(font, 50, 180, "Date: 2024-10-02");

      // Add table header
      image.print(font, 50, 240, "Item");
      image.print(font, 300, 240, "Qty");
      image.print(font, 400, 240, "Price");
      image.print(font, 500, 240, "Total");

      // Add table data
      image.print(font, 50, 280, "Product A");
      image.print(font, 300, 280, "2");
      image.print(font, 400, 280, "$50");
      image.print(font, 500, 280, "$100");

      image.print(font, 50, 320, "Product B");
      image.print(font, 300, 320, "1");
      image.print(font, 400, 320, "$75");
      image.print(font, 500, 320, "$75");

      // Add total
      image.print(font, 500, 400, "Total: $175");

      const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
      resolve(buffer);
    });
  });

  return promise;
}

module.exports = {
  createInvoiceImage,
};
