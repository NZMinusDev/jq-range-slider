import "./index.pug";
import "./index.scss";

import "@common.blocks/primitives/range-slider/range-slider-plugin";
import "@common.blocks/primitives/range-slider/jq-range-slider";
import { RangeSliderOptions } from "@common.blocks/primitives/range-slider/view/range-slider.view";
import RangeSliderModel from "@common.blocks/primitives/range-slider/models/range-slider.main-model";

const rangeSliderOptions: Partial<RangeSliderOptions> = {
  intervals: { min: -1250, "80%": -500, "90%": 400, max: 1500 },
  start: [-1250, -600, 1500],
  padding: 200,
  steps: [50, "none", 300],
  connect: [true, false, false, true],
  pips: {},
};

const sliders = $(".range-slider__pips-demo").initRangeSlider(
  rangeSliderOptions,
  new RangeSliderModel()
);

sliders[1].view.setOptions({
  orientation: "vertical",
  intervals: { min: -1250, "80%": -500, "90%": 400, max: 1500 },
  formatter: (number: number) => `${number.toFixed(2).toLocaleString()}$`,
  connect: [false, true, false, true],
  pips: { mode: "count", density: 5, values: 2 },
});

const theSecondSlider = document
  .querySelectorAll(".range-slider__pips-demo")
  .item(1) as HTMLElement;
theSecondSlider.style.height = `700px`;
