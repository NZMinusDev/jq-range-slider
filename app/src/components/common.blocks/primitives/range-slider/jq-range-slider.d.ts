interface JQuery {
  initRangeSlider(
    viewOptions?: Partial<import("./view/range-slider.view").RangeSliderOptions>,
    rangeSliderModel?: import("./models/range-slider.decl.model").RangeSliderModel
  ): import("./range-slider").default[];
}
