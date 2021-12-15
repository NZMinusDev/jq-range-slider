/**
 * Converts a string to an integer by collapse numbers
 * @param str - A string to convert into a number
 * @returns integer number
 */
const collapsingParseInt = (str: string, radix = 10): number =>
  Number(parseInt(str.replace(/[^0-9]-./g, ''), radix).toFixed(0));

export { collapsingParseInt as default };
