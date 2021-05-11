/**
 * Callback function for Array<number>.prototype.sort()
 */
export declare function ascending(a: number, b: number): number;
/**
 * Check even or not the number
 * @param number any number
 * @returns true if event false otherwise
 */
export declare function isEven(number: number): boolean;
/**
 * Callback function for Array<string>.prototype.sort()
 */
export declare function compareLocaleString(a: string, b: string): number;
/**
 * Replacement or str.slice() cause of surrogate couples support.
 */
export declare function slice(str: string, start: number, end: number): string;
