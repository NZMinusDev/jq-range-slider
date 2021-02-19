/// <reference path="./jq-range-slider.d.ts"/>:

import RangeSliderPresenter from "./range-slider";

(function ($, window, undefined) {
  $.fn.initRangeSlider = function (rangeSliderModel, viewOptions) {
    // this is jq collection

    return this.each(function () {
      new RangeSliderPresenter(rangeSliderModel, this, viewOptions);
      // this is html
    });
  };
})(jQuery, window);
