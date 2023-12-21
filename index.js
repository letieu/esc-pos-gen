const escpos = require('escpos');
escpos.Console = require('escpos-console');

async function createEscCode(imageLink) {
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

  escpos.Image.load(imageLink, "image/jpg", function (image) {
    printer
      .raster(image)
      .close();
  });

  return promise;
}

module.exports = {
  createEscCode
}
