/// <reference path="./jq-range-slider.d.ts"/>:

import RangeSliderPresenter from "./range-slider";
//FIXME: make model optional
(function ($, window, undefined) {
  $.fn.initRangeSlider = function (viewOptions, rangeSliderModel) {
    // "this" is jq collection
    const presenters: RangeSliderPresenter[] = [];
    this.each(function () {
      presenters.push(new RangeSliderPresenter([viewOptions], this, rangeSliderModel));
      // "this" is html
    });

    return presenters;
  };
})(jQuery, window);
