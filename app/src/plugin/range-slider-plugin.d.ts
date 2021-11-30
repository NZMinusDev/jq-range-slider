interface Window {
  RangeSliderPlugin: {
    new (
      ...args: ConstructorParameters<
        typeof import('./RangeSliderPlugin').default
      >
    ): import('./RangeSliderPlugin').default;
  };
}
