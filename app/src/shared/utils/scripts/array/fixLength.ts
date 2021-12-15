/**
 * Adds missing and removes extra elements
 */
const fixLength = <TArray extends unknown[]>(
  arr: TArray,
  desiredLength: number,
  filler: TArray[number]
) => {
  const copy = [...arr];
  const previousLength = copy.length;

  copy.length = desiredLength;

  if (previousLength < desiredLength) {
    return copy.fill(filler, previousLength);
  }

  return copy;
};

export { fixLength as default };
