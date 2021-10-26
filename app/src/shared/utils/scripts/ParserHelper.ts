/**
 * Converts a string to an integer by collapse numbers
 * @param str - A string to convert into a number
 * @returns integer number
 */
const collapsingParseInt = (str: string, radix = 10): number =>
  Number(parseInt(str.replace(/[^0-9]-./g, ''), radix).toFixed(0));

/**
 * Converts a string to a floating-point number by collapse numbers
 * @param str A string that contains a floating-point number
 * @param precision - amount of digits after the decimal point, must be in the range 0 - 20, inclusive
 * @returns
 */
const collapsingParseFloat = (str: string, precision = 2): number =>
  Number(Number(str.replace(/[^0-9-.]/g, '')).toFixed(precision));

export { collapsingParseInt, collapsingParseFloat };
