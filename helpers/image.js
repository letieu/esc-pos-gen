const jimp = require('jimp');

async function optimizeImage(image) {
  const jimpImage = await jimp.read(image);

  return await jimpImage
    .resize(576, jimp.AUTO)
    .greyscale()
    .getBufferAsync(jimp.MIME_JPEG);
}

module.exports = {
  optimizeImage,
}
