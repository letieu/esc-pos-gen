class SvgBuilder {
  constructor(width, fontFamily = "Arial, sans-serif") {
    this.width = width;
    this.lineSpacing = 20;
    this.lines = [];
    this.fontFamily = fontFamily;
  }

  /**
   * Adds a line to the SVG image.
   * @param {(y: number) => SvgBuilder} newLine - The function that adds a line to the SVG image.
   */
  addLine(newLine) {
    const y = (this.lines.length + 1) * this.lineSpacing;
    this.lines.push(newLine(y));
    return this;
  }

  getSvg() {
    const height = this.lines.length * this.lineSpacing;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${height}" style="font-family: ${this.fontFamily}">
        ${this.lines.join("")}
      </svg>
    `;
    return svg;
  }
}

/**
 * Formats a date object to a string in the format "dd/mm/yyyy hh:mm".
 *
 * @param {Date} date - The date object to be formatted.
 * @returns {string} - The formatted date string.
 */
function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

function numberFormat(number)
{
  return new Intl.NumberFormat('VN', { maximumSignificantDigits: 2 }).format(
      number,
  )
}


module.exports = {
  formatDate,
  SvgBuilder,
  numberFormat,
};
