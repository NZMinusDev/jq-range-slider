/**
 * @example
 * type T0 = Unpacked<string>;
 * //   ^ = type T0 = string
 * type T1 = Unpacked<string[]>;
 * //   ^ = type T1 = string
 * type T2 = Unpacked<() => string>;
 * //   ^ = type T2 = string
 * type T3 = Unpacked<Promise<string>>;
 * //   ^ = type T3 = string
 * type T4 = Unpacked<Promise<string>[]>;
 * //   ^ = type T4 = Promise
 * type T5 = Unpacked<Unpacked<Promise<string>[]>>;
 * //   ^ = type T5 = string
 * type T6 = Unpacked<Map<HTMLDivElement, {
 *   id: string;
 *   group: string;
 * }>>;
 * //   ^ = type T6 = { id: string; group: string; }
 * type T7 = Unpacked<NodeListOf<HTMLDivElement>>;
 * //   ^ = type T7 = HTMLDivElement
 */
type Unpacked<TType> = TType extends (infer TUnpacked)[]
  ? TUnpacked
  : TType extends (...args: unknown[]) => infer TUnpacked
  ? TUnpacked
  : TType extends Promise<infer TUnpacked>
  ? TUnpacked
  : TType extends Map<unknown, infer TUnpacked>
  ? TUnpacked
  : TType extends NodeListOf<infer TUnpacked>
  ? TUnpacked
  : TType;

export { Unpacked as default };
