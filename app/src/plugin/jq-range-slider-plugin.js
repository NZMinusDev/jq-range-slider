/// <reference path="./jq-range-slider-plugin.d.ts" />

(function ($, window, undefined) {
  $.fn.initRangeSlider = function (errorCatcher, viewOptions, rangeSliderModel) {
    const presenters = [];
    this.each(function () {
      presenters.push(
        new window.RangeSliderPresenter(this, errorCatcher, viewOptions, rangeSliderModel)
      );
    });

    return presenters;
  };
})(jQuery, window);
