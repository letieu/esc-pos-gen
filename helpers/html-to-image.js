const nodeHtmlToImage = require('node-html-to-image')

const CONATINER_WIDTH_SEARCH = 'max-width: 426px';

async function htmlToImage(html, selector = 'body', containerWidth = 380) {
  html = html.replace(CONATINER_WIDTH_SEARCH, `width: ${containerWidth}px`);

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
