/**
 * @example
 * interface SomeType {
 *   required: string;
 *   optional?: number;
 *   requiredButPossiblyUndefined: boolean | undefined;
 *   [k: string]: unknown; // index signature
 * }
 * type SomeTypeRequiredKeys = RequiredKeys<SomeType>;
 * // type SomeTypeRequiredKeys = "required" | "requiredButPossiblyUndefined" 🙂
 *
 * type SomeTypeOptionalKeys = OptionalKeys<SomeType>;
 * // type SomeTypeOptionalKeys = "optional" 🙂
 *
 * type SomeTypeIndexKeys = IndexKeyType<SomeType>;
 * // type SomeTypeIndexKeys = string 🙂
 */
type RequiredKeys<
  TObject extends { [key: number]: unknown } | { [key: string]: unknown }
> = {
  [TKey in keyof TObject]-?: string extends TKey
    ? never
    : number extends TKey
    ? never
    : {} extends Pick<TObject, TKey>
    ? never
    : TKey;
} extends { [_ in keyof TObject]-?: infer TInfer }
  ? TInfer extends keyof TObject
    ? TInfer
    : never
  : never;

export { RequiredKeys as default };
