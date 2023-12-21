const nodeHtmlToImage = require('node-html-to-image')

async function htmlToImage(html, selector = 'body') {
  return nodeHtmlToImage({
    selector: selector,
    transparent: false,
    html: html,
  })
}

module.exports = {
  htmlToImage
}
