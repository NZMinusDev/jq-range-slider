/**
 * Adds missing and removes extra elements
 */
declare const fixLength: <TArray extends unknown[]>(arr: TArray, desiredLength: number, filler: TArray[number]) => void;
export { fixLength };
