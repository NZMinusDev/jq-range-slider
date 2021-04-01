/// <reference path="./jq-range-slider.d.ts"/>:

import RangeSliderPresenter from "./range-slider";
//FIXME: make model optional
(function ($, window, undefined) {
  $.fn.initRangeSlider = function (rangeSliderModel, viewOptions) {
    // this is jq collection
    const presenters: RangeSliderPresenter[] = [];
    this.each(function () {
      presenters.push(new RangeSliderPresenter(rangeSliderModel, [viewOptions], this));
      // this is html
    });

    return presenters;
  };
})(jQuery, window);
