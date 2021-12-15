import OptionalKeys from './OptionalKeys';

type OptionalValues<TObject extends Record<string, unknown>> = Pick<
  TObject,
  OptionalKeys<TObject>
>;

export { OptionalValues as default };
