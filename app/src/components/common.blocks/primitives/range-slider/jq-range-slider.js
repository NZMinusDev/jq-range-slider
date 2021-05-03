/// <reference path="./jq-range-slider.d.ts"/>:

(function ($, window, undefined) {
  $.fn.initRangeSlider = function (viewOptions, rangeSliderModel) {
    const presenters = [];
    this.each(function () {
      presenters.push(new RangeSliderPresenter([viewOptions], this, rangeSliderModel));
    });

    return presenters;
  };
})(jQuery, window);
