interface Window {
  RangeSliderPresenter: {
    new (
      ...args: ConstructorParameters<
        import('./presenter/range-slider').RangeSliderPresenterConstructor
      >
    ): import('./presenter/range-slider').default;
  };
}
