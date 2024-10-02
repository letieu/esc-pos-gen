const express = require("express");
const { createInvoiceImage } = require("./helpers/invoice");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/image", async (req, res) => {
  try {
    const { width } = req.body;
    const image = await createInvoiceImage();
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
