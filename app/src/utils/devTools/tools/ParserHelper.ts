export function parseFileExtension(fullPath: string) {
  const filePath = fullPath.substring(0, fullPath.lastIndexOf(".")) || fullPath;
  const fileExt = fullPath.substring(fullPath.lastIndexOf(".") + 1, fullPath.length) || fullPath;
  return { filePath, fileExt };
}

export function collapsingParseInt(str: string): number {
  return +parseInt(str.replace(/[^0-9]-./g, "")).toFixed(0);
}
export function collapsingParseFloat(str: string, precision = 2): number {
  return +parseFloat(str.replace(/[^0-9-.]/g, "")).toFixed(precision);
}
export function getPrecision(number: number) {
  return number.toString().includes(".") ? number.toString().split(".").pop()!.length : 0;
}
