type IndexKeyType<TObject> = string extends keyof TObject
  ? string
  : number extends keyof TObject
  ? number
  : never;

export { IndexKeyType as default };
