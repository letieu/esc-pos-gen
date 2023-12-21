async function loadHtml(url, method = 'GET', token = '') {
  const response = await fetch(url, {
    method,
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
