import NonFunctionPropertyNames from './NonFunctionPropertyNames';

type NonFunctionProperties<TObject extends Record<string, unknown>> = Pick<
  TObject,
  NonFunctionPropertyNames<TObject>
>;

export { NonFunctionProperties as default };
