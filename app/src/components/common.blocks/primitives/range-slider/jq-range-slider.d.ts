interface JQuery {
  initRangeSlider(
    rangeSliderModel: import("./models/range-slider.decl.model").RangeSliderModel,
    viewOptions?: Partial<import("./view/range-slider.view").RangeSliderOptions>
  ): import("./range-slider").default[];
}
