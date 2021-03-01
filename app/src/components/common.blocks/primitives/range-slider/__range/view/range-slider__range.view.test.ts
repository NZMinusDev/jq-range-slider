import RangeSliderRangeView, { DEFAULT_OPTIONS, RangeOptions } from "./range-slider__range.view";

import { testInit } from "@utils/devTools/tools/UnitTestingHelper";

testInit(RangeSliderRangeView, DEFAULT_OPTIONS, {
  invalidOptions: [{ step: -10 }, { step: Infinity }, { step: 0 }],
  partialOptions: [{ isConnected: true }],
  fullOptions: [
    {
      isConnected: true,
      step: 100,
    },
  ],
  expectValidProperties({ viewOptions }) {
    if (viewOptions.step != "none") {
      expect(viewOptions.step).toBeGreaterThan(0);
      expect(viewOptions.step).toBeLessThanOrEqual(Number.MAX_VALUE);
    }
  },
});
