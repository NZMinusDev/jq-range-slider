interface Window {
  RangeSliderPresenter: {
    new (
      ...args: ConstructorParameters<
        import('./presenter/range-slider.coupling').IRangeSliderPresenterConstructor
      >
    ): import('./presenter/range-slider.coupling').default;
  };
}
