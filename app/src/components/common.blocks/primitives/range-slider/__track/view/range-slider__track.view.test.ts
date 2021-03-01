import RangeSliderTrackView, { DEFAULT_OPTIONS, TrackOptions } from "./range-slider__track.view";

import { testInit } from "@utils/devTools/tools/UnitTestingHelper";

testInit(RangeSliderTrackView, DEFAULT_OPTIONS, {
  invalidOptions: [
    { padding: -10, range: { min: -10, max: -15 } },
    { padding: Infinity, range: { min: Infinity, max: Infinity } },
    { padding: [5, -2], range: { min: 10, max: 5 } },
    { range: { "50%": -66 } },
    { range: { "50%": Infinity } },
    { range: { "60%": 200, "30%": 500 } },
    { range: { "101%": 10 } },
    { range: { 101: 10 } },
    { range: { "5%hgf": 10 } },
    { range: { "str5%hgf": 10 } },
  ],
  partialOptions: [{ padding: 10, range: { min: 0, max: 100000 } }],
  fullOptions: [
    {
      orientation: "vertical",
      padding: 5,
      range: {
        min: 5000,
        "25%": 10000,
        "66%": 145000,
        max: 150000,
      },
      animate: (timeFraction: number) => Math.pow(timeFraction, 3),
    },
  ],
  expectValidProperties({ viewOptions }) {
    let paddings: [number, number];
    if (!Array.isArray(viewOptions.padding)) {
      paddings = [viewOptions.padding, viewOptions.padding];
    } else {
      paddings = [...viewOptions.padding];
    }
    paddings.forEach((padding) => {
      expect(padding).toBeGreaterThanOrEqual(0);
      expect(padding).toBeLessThanOrEqual(50);
    });

    Object.keys(viewOptions.range)
      .sort((a, b) => {
        if (a === "min" || b === "max") {
          return -1;
        }
        if (a === "max" || b === "min") {
          return 1;
        }
        return parseFloat(a) - parseFloat(b);
      })
      .forEach((key, index, keys) => {
        if (key !== "min" && key !== "max") {
          expect(parseInt(key)).toBeGreaterThan(0);
          expect(parseInt(key)).toBeLessThan(100);
        }

        expect(viewOptions.range[key]).toBeGreaterThanOrEqual(0);
        expect(viewOptions.range[key]).toBeLessThanOrEqual(Number.MAX_VALUE);

        if (index > 0) {
          expect(viewOptions.range[key]).toBeGreaterThanOrEqual(
            viewOptions.range[keys[index - 1]] as number
          );
        }
      });

    expect(jest.fn(viewOptions.animate)(10)).toHaveReturned();
  },
});
