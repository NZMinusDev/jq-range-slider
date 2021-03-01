/// <reference path="./jq-range-slider.d.ts"/>:

import RangeSliderPresenter from "./range-slider";
//FIXME: make model optional
(function ($, window, undefined) {
  $.fn.initRangeSlider = function (rangeSliderModel, viewOptions) {
    // this is jq collection

    return this.each(function () {
      new RangeSliderPresenter(rangeSliderModel, this, viewOptions);
      // this is html
    });
  };
})(jQuery, window);
