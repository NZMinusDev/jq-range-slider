import RangeSliderThumbView, { DEFAULT_OPTIONS, ThumbOptions } from "./range-slider__thumb.view";

import { testInit } from "@utils/devTools/tools/UnitTestingHelper";

testInit(RangeSliderThumbView, DEFAULT_OPTIONS, {
  invalidOptions: [{ start: -10 }],
  fullOptions: [
    {
      start: 5000,
    },
  ],
  expectValidProperties({ viewOptions, view }) {
    expect((view as any)._id).toBeGreaterThanOrEqual(0);

    expect(viewOptions.start).toBeGreaterThanOrEqual(0);
  },
});
