/**
 * @example
 * type T1 = FilterType<[number, string, undefined, number],undefined>
 * // [number, string, number]
 * type T2 = FilterType<[1, undefined, 2],undefined> // [1, 2]
 * type T3 = FilterType<[undefined, 2],undefined> // [2]
 * type T4 = FilterType<[2, undefined],undefined> // [2]
 * type T5 = FilterType<[undefined, undefined, 2],undefined> // [2]
 * type T6 = FilterType<[undefined],undefined> // []
 * type T7 = FilterType<[],undefined> // []
 */
type FilterType<TTuple extends unknown[], TType> = TTuple extends []
  ? []
  : TTuple extends [infer H, ...infer R]
  ? H extends TType
    ? FilterType<R, TType>
    : [H, ...FilterType<R, TType>]
  : TTuple;

export { FilterType as default };
