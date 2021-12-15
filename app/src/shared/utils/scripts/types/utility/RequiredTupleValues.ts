import RequiredKeys from './RequiredKeys';
import FilterType from './FilterType';

type RequiredToNeverInTuple<TTuple extends unknown[]> = {
  [TKey in keyof TTuple]: TTuple[TKey] extends TTuple[RequiredKeys<TTuple>]
    ? TTuple[TKey]
    : never;
};

/**
 * @example
 * type MyTuple = [container:HTMLElement, id: number, name?:string, data?:{}]
 *
 * type MyTupleWithRequired = RequiredTupleValues<MyTuple>
 * // type MyTupleWithRequired = [HTMLElement, number]
 * type MyTupleWithOptional = OptionalTupleValues<MyTuple>
 * // type MyTupleWithRequired = [name?: string | undefined, data?: {} | undefined]
 */
type RequiredTupleValues<TTuple extends unknown[]> = FilterType<
  RequiredToNeverInTuple<TTuple>,
  never
>;

export { RequiredTupleValues as default };
