/// <reference path="./jq-range-slider-plugin.d.ts" />

(function ($, window, undefined) {
  $.fn.initRangeSlider = function (options, facadeModel) {
    const rangeSliderPlugins = [];
    this.each(function () {
      rangeSliderPlugins.push(
        new window.RangeSliderPresenter(this, { options, facadeModel })
      );
    });

    return rangeSliderPlugins;
  };
})(jQuery, window);
