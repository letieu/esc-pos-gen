const jimp = require('jimp');

async function optimizeImage(image) {
  const jimpImage = await jimp.read(image);

  return await jimpImage
    .greyscale()
    .getBufferAsync(jimp.MIME_PNG);
}

module.exports = {
  optimizeImage,
}
