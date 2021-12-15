/**
 * @example
 * interface Part {
 *   id: number;
 *   name: string;
 *   subparts: Part[];
 *   updatePart(newName: string): void;
 * }
 *
 * type T1 = FunctionPropertyNames<Part>;
 * //   ^ = type T1 = "updatePart"
 * type T2 = NonFunctionPropertyNames<Part>;
 * //   ^ = type T2 = "id" | "name" | "subparts"
 * type T3 = FunctionProperties<Part>;
 * //   ^ = type T3 = {
 * //       updatePart: (newName: string) => void;
 * //   }
 * type T4 = NonFunctionProperties<Part>;
 * //   ^ = type T4 = {
 * //       id: number;
 * //       name: string;
 * //       subparts: Part[];
 * //   }
 */
type FunctionPropertyNames<TObject extends Record<string, unknown>> = {
  [TKey in keyof TObject]: TObject[TKey] extends (...args: unknown[]) => unknown
    ? TKey
    : never;
}[keyof TObject];

export { FunctionPropertyNames as default };
