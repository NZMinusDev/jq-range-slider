interface JQuery {
  initRangeSlider(
    errorCatcher: import('./presenter/RangeSliderPresenter').ErrorCatcher,
    viewOptions?: Partial<import('./view/types').RangeSliderOptions>,
    rangeSliderModel?: import('./models/types').default
  ): import('./presenter/RangeSliderPresenter').default[];
}
