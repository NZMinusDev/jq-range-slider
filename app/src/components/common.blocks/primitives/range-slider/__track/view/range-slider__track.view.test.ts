import RangeSliderTrackView, { DEFAULT_OPTIONS } from "./range-slider__track.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
} from "@utils/devTools/tools/UnitTestingHelper";
import { collapsingParseFloat, getPrecision } from "@utils/devTools/tools/ParserHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderTrackView>,
  RangeSliderTrackView
> = function ({ instance }) {
  const keysOfIntervals = Object.keys(instance["_options"].intervals).sort((a, b) => {
    if (a === "min" || b === "max") {
      return -1;
    }
    if (a === "max" || b === "min") {
      return 1;
    }
    return collapsingParseFloat(a) - collapsingParseFloat(b);
  });
  let parsedKey;

  expect(instance["_options"].steps.length).toBe(keysOfIntervals.length - 1);

  expect(instance["_options"].intervals.min).toBeLessThan(instance["_options"].intervals.max);
  expect(instance["_options"].intervals.min).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
  expect(instance["_options"].intervals.max).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
  keysOfIntervals.forEach((key, index, keys) => {
    parsedKey = collapsingParseFloat(key);

    if (key !== "min" && key !== "max") {
      expect(key).toBe(`${parsedKey}%`);
      expect(parsedKey).toBeGreaterThan(0);
      expect(parsedKey).toBeLessThan(100);
      expect(getPrecision(parsedKey)).toBeLessThanOrEqual(2);
    }

    expect(getPrecision(instance["_options"].intervals[key])).toBeLessThanOrEqual(2);

    if (index > 0) {
      expect(instance["_options"].intervals[key]).toBeGreaterThanOrEqual(
        instance["_options"].intervals[keys[index - 1]]
      );
    }

    if (index < instance["_options"].steps.length && instance["_options"].steps[index] !== "none") {
      expect(instance["_options"].steps[index]).toBeGreaterThan(0);
      expect(instance["_options"].steps[index]).toBeLessThanOrEqual(
        Math.abs(
          instance["_options"].intervals[key] -
            instance["_options"].intervals[keysOfIntervals[index + 1]]
        )
      );
      expect(getPrecision(instance["_options"].steps[index] as number)).toBeLessThanOrEqual(2);
    }
  });

  instance["_options"].padding.forEach((pad) => {
    expect(pad).toBeLessThanOrEqual(
      +Math.abs(
        (instance["_options"].intervals[keysOfIntervals[keysOfIntervals.length - 1]] -
          instance["_options"].intervals[keysOfIntervals[0]]) /
          2
      ).toFixed(2)
    );
    expect(getPrecision(pad)).toBeLessThanOrEqual(2);
  });
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderTrackView.prototype.setOptions
>> = {
  invalidOptionalArguments: [
    [{ intervals: { min: 100, max: 100 } }],
    [{ intervals: { min: 100, max: 99 } }],
    [{ intervals: { min: -100, max: -110 } }],
    [{ intervals: { min: Number.MIN_SAFE_INTEGER - 1, max: Number.MAX_SAFE_INTEGER + 1 } }],
    [{ intervals: { min: -100, max: 100, 50: 50 } }],
    [{ intervals: { min: -100, max: 100, "0%": 50 } }],
    [{ intervals: { min: -100, max: 100, "-1%": 50 } }],
    [{ intervals: { min: -100, max: 100, "100%": 50 } }],
    [{ intervals: { min: -100, max: 100, "101%": 50 } }],
    [{ intervals: { min: -100, max: 100, "50.23436123%": 50 } }],
    [{ intervals: { min: -100, max: 100, "str5dsa%hgf": 50 } }],
    [{ intervals: { min: -100.4532543, max: 100.897987, "50%": 50.74563 } }],
    [{ intervals: { min: 100, max: -100, "25%": 50, "50%": 10, "75%": -50 } }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, steps: [] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, steps: [10] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, steps: [10, 15, 20, 1, 5] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, steps: [-10, 0] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, steps: [300, 500] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, steps: [5.543543, 10.54876] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, padding: -10 }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, padding: 249 }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, padding: 10.76589645 }],
  ],
  partialOptionalArguments: [[{ padding: [10.5, 15.04] }]],
  fullOptionalArguments: [
    [
      {
        orientation: "vertical",
        intervals: { min: -999, max: 999, "25%": -900, "75%": 0 },
        steps: [1, 100, 11],
        padding: [10, 5],
      },
    ],
  ],
};

testInitDEFAULT_OPTIONS(
  RangeSliderTrackView,
  [document.createElement("div"), DEFAULT_OPTIONS],
  viewPropertiesExpecter
);

testInit({
  Creator: RangeSliderTrackView,
  differentConstructorArgs: {
    validRequiredArguments: [[document.createElement("div")]],
    ...(differentOptionsArg as DifferentArguments<
      ConstructorParameters<typeof RangeSliderTrackView>
    >),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("dom.self", 0).set("_options", 1),
});
describe("init", () => {
  describe("with steps, padding, options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const sliderOptions = (new RangeSliderTrackView(document.createElement("div"), {
        intervals: { min: -200, max: 200, "50%": -100 },
        steps: 2,
        padding: 20,
      }) as any)._options as typeof DEFAULT_OPTIONS;

      expect(sliderOptions.steps).toStrictEqual([2, 2]);
      expect(sliderOptions.padding).toStrictEqual([20, 20]);
    });
  });
});

testGetter({
  Creator: RangeSliderTrackView,
  constructorArgs: [document.createElement("div")],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderTrackView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testSetter({
  Creator: RangeSliderTrackView,
  constructorArgs: [document.createElement("div")],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderTrackView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});
describe("setOptions", () => {
  describe("with steps, padding options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const sliderOptions = (new RangeSliderTrackView(document.createElement("div"), {
        intervals: { min: -2000, max: 2000, "50%": -1000, "75%": 1800 },
        steps: [10, 15, 20],
        padding: [30, 45],
      }).setOptions({
        steps: 2,
        padding: 20,
      }) as any)._options as typeof DEFAULT_OPTIONS;

      expect(sliderOptions.steps).toStrictEqual([2, 2, 2]);
      expect(sliderOptions.padding).toStrictEqual([20, 20]);
    });
  });
});
