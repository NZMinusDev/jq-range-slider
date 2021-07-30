interface JQuery {
  initRangeSlider(
    viewOptions?: Partial<import('./view/range-slider.view.coupling').RangeSliderOptions>,
    rangeSliderModel?: import('./models/range-slider.model.coupling').default
  ): import('./presenter/range-slider.coupling').default[];
}
