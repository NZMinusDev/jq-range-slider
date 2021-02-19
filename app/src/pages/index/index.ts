import "./index.pug";

import "@common.blocks/primitives/range-slider/jq-range-slider";
import { RangeSliderOptions } from "@common.blocks/primitives/range-slider/view/range-slider.view";
import RangeSliderModel from "@common.blocks/primitives/range-slider/models/range-slider.main-model";

const rangeSliderOptions: Partial<RangeSliderOptions> = {};

const $rangeSliders = $(".content-container").initRangeSlider(
  new RangeSliderModel(),
  rangeSliderOptions
);
