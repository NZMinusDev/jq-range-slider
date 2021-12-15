type BoxedValue<TType> = { value: TType };
type BoxedArray<TType> = { array: TType[] };

/**
 * @example
 * type T1 = Boxed<string>;
 * //   ^ = type T1 = {
 * //       value: string;
 * //   }
 * type T2 = Boxed<number[]>;
 * //   ^ = type T2 = {
 * //       array: number[];
 * //   }
 * type T3 = Boxed<string | number[]>;
 * //   ^ = type T3 = BoxedValue | BoxedArray
 */
type Boxed<TType> = TType extends unknown[]
  ? BoxedArray<TType[number]>
  : BoxedValue<TType>;

export { Boxed as default };
