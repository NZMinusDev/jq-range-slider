/**
 * @example
 * type test = {
 *   param: number;
 *   param2: number[];
 *   param3: () => void;
 *   param4?: string[][];
 *   param5: { p1: string; p2: number };
 * };
 * let test: ArrayPacked<test> = {
 *   param: [1, 2],
 *   param2: [
 *     [1, 2],
 *     [1, 4],
 *   ],
 *   param3: [() => {}, () => {}, () => {}],
 *   param5: [{ p1: "p1", p2: 0 }],
 * };
 */
type ArrayPacked<TObject extends Record<string, unknown>> = {
  [TKey in keyof TObject]: TObject[TKey][];
};

export { ArrayPacked as default };
