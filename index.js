const express = require('express');
const { loadHtmlFromUrl: loadHtml } = require('./helpers/network');
const { htmlToImage } = require('./helpers/html-to-image');
const { createEscCodeFromImage, createEscCodeTest } = require('./helpers/printer');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/esc', async (req, res) => {
  try {
    const { url, token, method, width } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Please provide url.' });
    }

    const html = await loadHtml(url, method, token);
    const image = await htmlToImage(html, 'body > .container', width);

    const imageBase64 = `data:image/png;base64,${image.toString('base64')}`
    const command = await createEscCodeFromImage(imageBase64);

    res.status(200).json(command.toJSON().data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.get('/image', async (req, res) => {
  try {
    const { url, html, token, method, width, selector } = req.query;

    if (!url && !html) {
      return res.status(400).json({ error: 'Please provide URL or HTML.' });
    }

    const htmlContent = html || await loadHtml(url, method, token);

    const imageSelector = selector || 'body';
    const image = await htmlToImage(htmlContent, imageSelector, width);

    res.set('Content-Type', 'image/png');
    res.status(200).send(image);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.get('/test', async (req, res) => {
  res.sendFile(__dirname + '/bill-test.html');
});

app.get('/test-esc', async (req, res) => {
  try {
    const command = await createEscCodeTest();

    res.status(200).json(command.toJSON().data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
