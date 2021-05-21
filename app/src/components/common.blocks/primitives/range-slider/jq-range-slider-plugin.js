/// <reference path="./jq-range-slider-plugin.d.ts" />

(function ($, window, undefined) {
  $.fn.initRangeSlider = function (viewOptions, rangeSliderModel) {
    const presenters = [];
    this.each(function () {
      presenters.push(new RangeSliderPresenter(this, viewOptions, rangeSliderModel));
    });

    return presenters;
  };
})(jQuery, window);
