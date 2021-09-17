interface JQuery {
  initRangeSlider(
    errorCatcher: import('./presenter/RangeSliderPresenter').ErrorCatcher,
    viewOptions?: Partial<import('./view/IRangeSliderView').RangeSliderOptions>,
    rangeSliderModel?: import('./models/IRangeSliderModel').default
  ): import('./presenter/RangeSliderPresenter').default[];
}
