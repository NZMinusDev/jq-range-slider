type OptionalKeys<TObject extends Record<string, unknown>> = {
  [TKey in keyof TObject]-?: string extends TKey
    ? never
    : number extends TKey
    ? never
    : {} extends Pick<TObject, TKey>
    ? TKey
    : never;
} extends { [_ in keyof TObject]-?: infer TInfer }
  ? TInfer extends keyof TObject
    ? TInfer
    : never
  : never;

export { OptionalKeys as default };
