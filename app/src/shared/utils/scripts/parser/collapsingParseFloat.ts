/**
 * Converts a string to a floating-point number by collapse numbers
 * @param str A string that contains a floating-point number
 * @param precision - amount of digits after the decimal point, must be in the range 0 - 20, inclusive
 * @returns
 */
const collapsingParseFloat = (str: string, precision = 2): number =>
  Number(Number(str.replace(/[^0-9-.]/g, '')).toFixed(precision));

export { collapsingParseFloat as default };
