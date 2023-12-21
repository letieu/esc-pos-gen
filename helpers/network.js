async function loadHtml(url, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + token
    },
  })
  const html = await response.text()
  return html
}

module.exports = {
  loadHtml
}
