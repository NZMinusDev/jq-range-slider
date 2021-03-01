import RangeSliderTooltipView, {
  DEFAULT_OPTIONS,
  TooltipOptions,
} from "./range-slider__tooltip.view";

import { testInit } from "@utils/devTools/tools/UnitTestingHelper";

testInit(RangeSliderTooltipView, DEFAULT_OPTIONS, {
  partialOptions: [{ isHidden: true }],
  fullOptions: [
    {
      formatter: {
        to: (value: number) => `${value.toString()}$`,
        from: (value: string) => +parseFloat(value).toFixed(4),
      },
      isHidden: true,
    },
  ],
  expectValidProperties({ viewOptions }) {
    expect(jest.fn(viewOptions.formatter?.from)("12.345")).toHaveReturned();
    expect(jest.fn(viewOptions.formatter?.to)(12.345)).toHaveReturned();
  },
});
