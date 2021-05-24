/**
 * Adds missing and removes extra elements
 */
// eslint-disable-next-line import/prefer-default-export
export function fixLength<TArray extends unknown[]>(
  arr: TArray,
  desiredLength: number,
  filler: TArray[number]
) {
  const previousLength = arr.length;
  if (arr.length !== desiredLength) {
    // eslint-disable-next-line no-param-reassign
    arr.length = desiredLength;
    // eslint-disable-next-line no-param-reassign
    arr = arr.fill(filler, previousLength);
  }
}
