import "./index.pug";
import "./index.scss";

import "@common.blocks/primitives/range-slider/jq-range-slider";
import { RangeSliderOptions } from "@common.blocks/primitives/range-slider/view/range-slider.view";
import RangeSliderModel from "@common.blocks/primitives/range-slider/models/range-slider.main-model";

const rangeSliderOptions: Partial<RangeSliderOptions> = {
  intervals: { min: -750, max: 500 },
  start: [-750, 0, 500],
  pips: {},
};

const sliders = $(".range-slider__pips-demo").initRangeSlider(
  new RangeSliderModel(),
  rangeSliderOptions
);

sliders[1].view.setOptions({
  intervals: { min: -1250, "80%": -500, "90%": 400, max: 1500 },
  formatter: (number: number) => `${number.toFixed(2).toLocaleString()}$`,
  pips: { mode: "positions", density: 5, values: [0, 80, 90, 100] },
});
