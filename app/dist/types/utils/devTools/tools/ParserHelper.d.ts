/**
 * Converts a string to an integer by collapse numbers
 * @param str - A string to convert into a number
 * @returns integer number
 */
declare const collapsingParseInt: (str: string, radix?: number) => number;
/**
 * Converts a string to a floating-point number by collapse numbers
 * @param str A string that contains a floating-point number
 * @param precision - amount of digits after the decimal point, must be in the range 0 - 20, inclusive
 * @returns
 */
declare const collapsingParseFloat: (str: string, precision?: number) => number;
export { collapsingParseInt, collapsingParseFloat };
