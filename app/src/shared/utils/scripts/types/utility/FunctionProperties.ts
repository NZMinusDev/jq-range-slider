import FunctionPropertyNames from './FunctionPropertyNames';

type FunctionProperties<TObject extends Record<string, unknown>> = Pick<
  TObject,
  FunctionPropertyNames<TObject>
>;

export { FunctionProperties as default };
