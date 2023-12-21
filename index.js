const express = require('express');
const { loadHtml } = require('./helpers/network');
const { htmlToImage } = require('./helpers/html-to-image');
const { createEscCodeFromImage, createEscCodeTest } = require('./helpers/printer');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/esc', async (req, res) => {
  try {
    const { url, token } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Please provide HTML content.' });
    }

    const html = await loadHtml(url, token);
    const image = await htmlToImage(html, 'body > .container');

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
    const { url, token, method } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Please provide HTML content.' });
    }

    const html = await loadHtml(url, method, token);
    const image = await htmlToImage(html, 'body > .container');

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
