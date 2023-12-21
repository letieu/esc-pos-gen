const express = require('express');
const { loadHtml } = require('./helpers/network');
const { htmlToImage } = require('./helpers/html-to-image');
const { optimizeImage } = require('./helpers/image');
const { createEscCode } = require('.');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/generate-image', async (req, res) => {
  try {
    const { url, token } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Please provide HTML content.' });
    }

    const html = await loadHtml(url, token);
    const image = await htmlToImage(html, 'body > .container');
    const optimizedImage = await optimizeImage(image);

    const imageBase64 = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`
    const command = await createEscCode(imageBase64);

    res.status(200).json(command.toJSON());
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
