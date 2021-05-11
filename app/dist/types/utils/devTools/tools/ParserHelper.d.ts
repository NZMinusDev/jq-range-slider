/**
 * Get file path without extension and extension separately
 * @param fullPath - path to file
 * @returns file path without extension and file extension parts, comma non included
 */
export declare function parseFileExtension(fullPath: string): {
    filePath: string;
    fileExt: string;
};
/**
 * Converts a string to an integer by collapse numbers
 * @param str - A string to convert into a number
 * @returns integer number
 */
export declare function collapsingParseInt(str: string): number;
/**
 * Converts a string to a floating-point number by collapse numbers
 * @param str A string that contains a floating-point number
 * @param precision - amount of digits after the decimal point, must be in the range 0 - 20, inclusive
 * @returns
 */
export declare function collapsingParseFloat(str: string, precision?: number): number;
/**
 * Get amount of digits after the decimal point
 * @param number A number
 * @returns amount of digits after the decimal point
 */
export declare function getPrecision(number: number): number;
