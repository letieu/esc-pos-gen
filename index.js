const express = require("express");
const { loadHtmlFromUrl: loadHtml } = require("./helpers/network");
const { htmlToImage } = require("./helpers/html-to-image");
const { createInvoiceImage } = require("./helpers/invoice");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/image", async (req, res) => {
  try {
    const { url, html, token, method, width, selector, type } = req.body;

    if (!url && !html) {
      return res.status(400).json({ error: "Please provide URL or HTML." });
    }

    const htmlContent = html || (await loadHtml(url, method, token));

    const imageSelector = selector || "html";
    const image = await htmlToImage(htmlContent, imageSelector, width, type);

    if (type === "base64") {
      const base64 = `data:image/png;base64,${image.toString("base64")}`;
      res.status(200).send(base64);
    } else {
      res.set("Content-Type", `image/${type}`);
      res.status(200).send(image);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/image/v2", async (req, res) => {
  try {
    const { width } = req.body;
    const image = createInvoiceImage();
    const base64 = `data:image/png;base64,${image.toString("base64")}`;
    res.status(200).send(base64);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong.", cause: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
