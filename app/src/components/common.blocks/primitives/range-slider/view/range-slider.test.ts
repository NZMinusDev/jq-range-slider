import RangeSlider from "../range-slider";
import RangeSliderView, { DEFAULT_OPTIONS, RangeSliderOptions } from "./range-slider.view";

import { testInit } from "@utils/devTools/tools/UnitTestingHelper";

testInit(RangeSliderView, DEFAULT_OPTIONS, {
  expectValidProperties() {},
});
