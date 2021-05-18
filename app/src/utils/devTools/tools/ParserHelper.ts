/**
 * Converts a string to an integer by collapse numbers
 * @param str - A string to convert into a number
 * @returns integer number
 */
export function collapsingParseInt(str: string): number {
  return +parseInt(str.replace(/[^0-9]-./g, "")).toFixed(0);
}
/**
 * Converts a string to a floating-point number by collapse numbers
 * @param str A string that contains a floating-point number
 * @param precision - amount of digits after the decimal point, must be in the range 0 - 20, inclusive
 * @returns
 */
export function collapsingParseFloat(str: string, precision = 2): number {
  return +parseFloat(str.replace(/[^0-9-.]/g, "")).toFixed(precision);
}
