const nodeHtmlToImage = require('node-html-to-image')

async function htmlToImage(html, selector = 'body') {
  return nodeHtmlToImage({
    selector: selector,
    transparent: false,
    html: html,
    puppeteerArgs: {
      args: [
        '--no-sandbox',
        '--disable - setuid - sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    },
  })
}

module.exports = {
  htmlToImage
}
