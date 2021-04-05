import "./index.pug";
import "./index.scss";

import "@common.blocks/primitives/range-slider/jq-range-slider";
import { RangeSliderOptions } from "@common.blocks/primitives/range-slider/view/range-slider.view";
import RangeSliderModel from "@common.blocks/primitives/range-slider/models/range-slider.main-model";

const rangeSliderOptions: Partial<RangeSliderOptions> = {
  start: 50,
  pips: {},
};

const sliders = $(".range-slider__pips-demo").initRangeSlider(
  new RangeSliderModel(),
  rangeSliderOptions
);

sliders[1].view.setOptions({
  intervals: { min: -750, max: 500 },
  formatter: (number: number) => `${number.toFixed(2).toLocaleString()}$`,
  pips: { mode: "values", density: 5, values: [500, -750, -100, 0, 100, 200] },
});
