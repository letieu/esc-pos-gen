const escpos = require('escpos');
const path = require('path');
escpos.Console = require('escpos-console');

async function createEscCodeFromImage(imageLink) {
  let resolver, rejecter;

  const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });

  const handler = (data) => {
    resolver(data);
  };

  const device = new escpos.Console(handler);
  const options = { encoding: "GB18030" }
  const printer = new escpos.Printer(device, options);

  escpos.Image.load(imageLink, "image/png", function (image) {
    printer
      .raster(image)
      .close();
  });

  return promise;
}

async function createEscCodeTest() {
  let resolver, rejecter;

  const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });

  const handler = (data) => {
    resolver(data);
  };

  const device = new escpos.Console(handler);
  const options = { encoding: "GB18030" }
  const printer = new escpos.Printer(device, options);

  const imageLink = path.resolve(__dirname, '../image-fs8.png');

  escpos.Image.load(imageLink, "image/png", function (image) {
    printer
      .raster(image)
      .close();
  });

  return promise;
}

module.exports = {
  createEscCodeFromImage,
  createEscCodeTest,
}
