import "./index.pug";
import "./index.scss";

import "@common.blocks/primitives/range-slider/jq-range-slider";
import { RangeSliderOptions } from "@common.blocks/primitives/range-slider/view/range-slider.view";
import RangeSliderModel from "@common.blocks/primitives/range-slider/models/range-slider.main-model";

const rangeSliderOptions: Partial<RangeSliderOptions> = {
  pips: {},
};

const sliders = $(".range-slider__pips-demo").initRangeSlider(new RangeSliderModel(), {
  intervals: { min: -1000, max: 1000 },
});

sliders[0].view.setOptions({
  pips: {
    density: 0,
  },
});
sliders[1].view.setOptions({
  formatter: (number: number) => number.toFixed(0).toLocaleString(),
  pips: { mode: "count", density: 2, values: 5 },
});
sliders[2].view.setOptions({
  formatter: (number: number) => number.toFixed(4).toLocaleString(),
  pips: { mode: "positions", density: 3, values: [0, 25, 75, 100] },
});
sliders[3].view.setOptions({
  formatter: (number: number) => `${number.toFixed(2).toLocaleString()}$`,
  pips: { mode: "values", density: 5, values: [500, -750, -100, 0, 100, 200] },
});
