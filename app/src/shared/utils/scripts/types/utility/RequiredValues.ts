import RequiredKeys from './RequiredKeys';

/**
 * @example
 * interface SomeType {
 *   required: string;
 *   optional?: number;
 *   requiredButPossiblyUndefined: boolean | undefined;
 *   [k: string]: unknown; // index signature
 * }
 * type T =  RequiredValues<SomeType>
 * // { required: string; requiredButPossiblyUndefined: boolean | undefined; }
 * type T2 =  OptionalValues<SomeType>
 * // { optional?: number | undefined; }
 */
type RequiredValues<TObject extends Record<string, unknown>> = Pick<
  TObject,
  RequiredKeys<TObject>
>;

export { RequiredValues as default };
