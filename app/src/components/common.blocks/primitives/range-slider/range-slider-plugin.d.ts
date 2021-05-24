interface Window {
  RangeSliderPresenter: {
    new (
      ...args: ConstructorParameters<
        import('./range-slider.coupling').RangeSliderPresenterConstructor
      >
    ): import('./range-slider.coupling').default;
  };
}
