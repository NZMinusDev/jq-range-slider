import FilterType from './FilterType';
import RequiredKeys from './RequiredKeys';

type OptionalToNeverInTuple<TTuple extends unknown[]> = {
  [TKey in keyof TTuple]: RequiredKeys<TTuple> extends never
    ? TTuple[TKey]
    : TTuple[TKey] extends TTuple[RequiredKeys<TTuple>]
    ? null
    : TTuple[TKey];
};

type OptionalTupleValues<TTuple extends unknown[]> = FilterType<
  OptionalToNeverInTuple<TTuple>,
  null
>;

export { OptionalTupleValues as default };
