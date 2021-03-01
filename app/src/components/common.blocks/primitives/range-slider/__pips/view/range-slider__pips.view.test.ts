import RangeSliderPipsView, { DEFAULT_OPTIONS, PipsOptions } from "./range-slider__pips.view";

import { testInit } from "@utils/devTools/tools/UnitTestingHelper";

testInit(RangeSliderPipsView, DEFAULT_OPTIONS, {
  invalidOptions: [
    { amount: -2, density: 5.5543 },
    { amount: 5.5543, density: -2 },
  ],
  partialOptions: [{ mode: "count", amount: 3 }],
  fullOptions: [
    {
      mode: "count",
      amount: 4,
      density: 6,
      formatter: {
        to: (value: number) => `${value.toString()}$`,
        from: (value: string) => +parseFloat(value).toFixed(4),
      },
    },
  ],
  expectValidProperties({ viewOptions, passedOptions }) {
    expect(viewOptions.amount).toBeGreaterThanOrEqual(2);
    expect(viewOptions.amount).toEqual(parseInt(`${viewOptions.amount}`));

    expect(viewOptions.density).toBeGreaterThanOrEqual(0);
    expect(viewOptions.density).toEqual(parseInt(`${viewOptions.density}`));

    expect(viewOptions.formatter).not.toBe(passedOptions.formatter);
    expect(viewOptions.formatter).toStrictEqual(passedOptions.formatter);
  },
});
