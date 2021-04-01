import RangeSliderView, { DEFAULT_OPTIONS } from "./range-slider.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
} from "@utils/devTools/tools/UnitTestingHelper";
import { ascending } from "@utils/devTools/tools/ProcessingOfPrimitiveDataHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderView>,
  RangeSliderView
> = function ({ instance, passedArgs }) {
  const passedOptions = passedArgs[0];

  expect(instance["_subViews"]["rangesView"].length).toBe(instance["_options"].start.length + 1);
  expect(instance["_subViews"]["thumbsView"].length).toBe(instance["_options"].start.length);
  expect(instance["_subViews"]["tooltipsView"].length).toBe(instance["_options"].tooltips.length);

  expect(instance["_options"].connect.length).toBe(instance["_options"].start.length + 1);
  expect(instance["_options"].tooltips.length).toBe(instance["_options"].start.length);

  instance["_options"].start.forEach((startValue, index) => {
    expect(startValue).toBeGreaterThanOrEqual(instance["_options"].intervals.min);
    expect(startValue).toBeLessThanOrEqual(instance["_options"].intervals.max);

    if (index > 0) {
      expect(startValue).toBeGreaterThanOrEqual(instance["_options"].start[index - 1]);
    }

    if (passedOptions?.tooltips?.[index] === true) {
      expect(instance["_subViews"]["tooltipsView"][index].getFormatterOption()).toBe(
        instance["_options"].formatter
      );
      expect(instance["_subViews"]["tooltipsView"][index].getIsHiddenOption()).toBe(false);
    } else if (passedOptions?.tooltips?.[index] === false) {
      expect(instance["_subViews"]["tooltipsView"][index].getIsHiddenOption()).toBe(true);
    } else if (typeof passedOptions?.tooltips?.[index] === "function") {
      expect(instance["_subViews"]["tooltipsView"][index].getFormatterOption()).toBe(
        passedOptions.tooltips[index]
      );
    }
  });

  switch (instance["_options"].pips.mode) {
    case "intervals": {
      expect(instance["_options"].pips.values).toStrictEqual(
        Object.values(instance["_options"].intervals).sort(ascending)
      );
      break;
    }
    case "count": {
      expect(instance["_options"].pips.values).toBeGreaterThanOrEqual(0);

      const shift = +(
        (instance["_options"].intervals.max - instance["_options"].intervals.min) /
        ((instance["_options"].pips.values as number) - 1)
      ).toFixed(2);
      let accumulator = instance["_options"].intervals.min;
      instance["_subViews"]["pipsView"]["_options"].values.forEach((value) => {
        expect(value).toBe(accumulator);
        accumulator += shift;
      });
      break;
    }
    case "positions": {
      expect(instance["_options"].pips.values).toStrictEqual(
        (instance["_options"].pips.values as number[]).filter((value) => value >= 0 && value <= 100)
      );

      const perPercent = +(
        (instance["_options"].intervals.max - instance["_options"].intervals.min) /
        100
      ).toFixed(2);
      expect(instance["_subViews"]["pipsView"]["_options"].values).toStrictEqual(
        (instance["_options"].pips.values as number[]).map((value) => value * perPercent)
      );
      break;
    }
    case "values": {
      expect(instance["_options"].pips.values).toStrictEqual(
        (instance["_options"].pips.values as number[]).filter(
          (value) =>
            value >= instance["_options"].intervals.min &&
            value <= instance["_options"].intervals.max
        )
      );
      break;
    }
  }

  const formatterMock = jest.fn(instance["_options"].formatter);
  formatterMock(10);
  expect(formatterMock).toHaveReturned();

  const animateMock = jest.fn(instance["_options"].animate);
  animateMock(10);
  expect(animateMock).toHaveReturned();
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderView.prototype.setOptions
>> = {
  invalidOptionalArguments: [
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-50, 0, 75], connect: [] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-50, 0, 75], connect: [true] }],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [-50, 0, 75],
        connect: [true, false, true, true, true, false],
      },
    ],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-50, 0, 75], tooltips: [] }],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [-50, 0, 75],
        tooltips: [true, false],
      },
    ],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [-50, 0, 75],
        tooltips: [true, false, true, true, true, false],
      },
    ],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-101] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [101] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [50, -50, -75, 0, 10] }],
    [{ pips: { mode: "intervals", values: 5 } }],
    [{ pips: { mode: "intervals", values: [0, 0, -10, 50, -99] } }],
    [{ pips: { mode: "count", values: -3 } }],
    [{ pips: { mode: "count", values: [0, 50, 100] } }],
    [{ pips: { mode: "positions", values: 10 } }],
    [{ pips: { mode: "positions", values: [-50, -1, 0, 99, 100, 101] } }],
    [{ pips: { mode: "values", values: 2 } }],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        pips: { mode: "values", values: [-101, -100, 50, 99, 101] },
      },
    ],
  ],
  partialOptionalArguments: [
    [
      {
        intervals: { min: -100, max: 100, "50%": 25 },
        start: [0, 75],
        steps: [10, 5],
        connect: [true, false, true],
        padding: [10, 5],
        tooltips: [true, false],
      },
    ],
  ],
  fullOptionalArguments: [
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [0, 75],
        steps: [10, 5],
        connect: [false, true, false],
        orientation: "vertical",
        padding: [10, 5],
        formatter: (number: number) => `${number.toFixed(2).toLocaleString()}$`,
        tooltips: [true, (number: number) => `${number.toFixed(4).toLocaleString()}%`],
        pips: { mode: "count", values: 4, density: 5 },
        animate: (timeFraction: number) => timeFraction ** 3,
      },
    ],
  ],
};

testInitDEFAULT_OPTIONS(RangeSliderView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderView,
  differentConstructorArgs: {
    validRequiredArguments: [[]],
    ...(differentOptionsArg as DifferentArguments<ConstructorParameters<typeof RangeSliderView>>),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("_options", 1),
});
describe("init", () => {
  describe("with start, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const sliderOptions = (new RangeSliderView({
        intervals: { min: -200, max: 200, "50%": -100 },
        start: -100,
        tooltips: false,
        connect: true,
      }) as any)._options as typeof DEFAULT_OPTIONS;

      expect(sliderOptions.start).toStrictEqual([-100]);
      expect(sliderOptions.tooltips).toStrictEqual([false]);
      expect(sliderOptions.connect).toStrictEqual([true, true]);
    });
  });
});

testGetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testSetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});
describe("setOptions", () => {
  describe("with start, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const sliderOptions = (new RangeSliderView({
        intervals: { min: -2000, max: 2000, "50%": -1000, "75%": 1800 },
        start: [-100, -50, 0, 50],
        tooltips: [true, false, true, false],
        connect: [true, false, true, false, true],
      }).setOptions({
        start: -100,
        tooltips: false,
        connect: true,
      }) as any)._options as typeof DEFAULT_OPTIONS;

      expect(sliderOptions.start).toStrictEqual([-100, -100, -100, -100]);
      expect(sliderOptions.tooltips).toStrictEqual([false, false, false, false]);
      expect(sliderOptions.connect).toStrictEqual([true, true, true, true, true]);
    });
  });
});
describe("setOptions", () => {
  describe("with options which change amount of ranges/thumbs/tooltips subViews", () => {
    test("instance's amount of the subViews should be the same as options are set", () => {
      const slider = new RangeSliderView({
        intervals: { min: -2000, max: 2000, "50%": -1000, "75%": 1800 },
        start: [-100, -50, 0, 50],
        tooltips: [true, false, true, false],
        connect: [false, true, false, true, false],
      }).setOptions({
        start: [-1000, 1000],
        tooltips: [true, false],
        connect: [true, false, true],
      });

      expect(slider["_subViews"]["thumbsView"].length).toBe(2);
      expect(slider["_subViews"]["tooltipsView"].length).toBe(2);
      expect(slider["_subViews"]["rangesView"].length).toBe(3);
    });
  });
});
