type NonFunctionPropertyNames<TObject extends Record<string, unknown>> = {
  [TKey in keyof TObject]: TObject[TKey] extends (...args: unknown[]) => unknown
    ? never
    : TKey;
}[keyof TObject];

export { NonFunctionPropertyNames as default };
