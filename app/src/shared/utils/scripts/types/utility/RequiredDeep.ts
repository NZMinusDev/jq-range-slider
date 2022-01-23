type RequiredDeep<T> = T extends Record<string, unknown>
  ? {
      [P in keyof T]-?: RequiredDeep<T[P]>;
    }
  : T;

export { RequiredDeep as default };
