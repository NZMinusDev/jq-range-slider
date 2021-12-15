type GenericFunc<TFuncArgs extends unknown[], TFuncReturn extends unknown> = (
  ...funcArgs: TFuncArgs
) => TFuncReturn;

export { GenericFunc as default };
