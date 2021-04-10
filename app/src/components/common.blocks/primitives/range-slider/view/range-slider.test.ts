import RangeSliderView, { DEFAULT_OPTIONS } from "./range-slider.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from "@utils/devTools/tools/UnitTestingHelper";
import { ascending } from "@utils/devTools/tools/ProcessingOfPrimitiveDataHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderView>,
  RangeSliderView
> = function ({ instance, passedArgs }) {
  expect(instance["_options"].connect.length).toBe(instance["_options"].start.length + 1);
  expect(instance["_options"].tooltips.length).toBe(instance["_options"].start.length);

  instance["_options"].start.forEach((startValue, index) => {
    expect(startValue).toBeGreaterThanOrEqual(instance["_options"].intervals.min);
    expect(startValue).toBeLessThanOrEqual(instance["_options"].intervals.max);

    if (index > 0) {
      expect(startValue).toBeGreaterThanOrEqual(instance["_options"].start[index - 1]);
    }
  });

  switch (instance["_options"].pips.mode) {
    case "count": {
      expect(instance["_options"].pips.values).toBeGreaterThanOrEqual(0);

      break;
    }
    case "positions": {
      expect(instance["_options"].pips.values).toStrictEqual(
        (instance["_options"].pips.values as number[]).filter((value) => value >= 0 && value <= 100)
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

testDOM({
  Creator: RangeSliderView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});

//TODO: render is run only once
// const MockRangeSliderView = (jest.createMockFromModule("./range-slider.view.ts") as any)
//   .default as jest.Mock<RangeSliderView, ConstructorParameters<typeof RangeSliderView>>;
// describe("classMock", () => {
//   beforeEach(() => {
//     MockRangeSliderView.mockClear();
//   });

//   test("init 1", () => {
//     const pipsInstance = new MockRangeSliderView();

//     pipsInstance.set(10);
//   });
//   test("init 2", () => {
//     expect(MockRangeSliderView).not.toHaveBeenCalled();

//     const pipsInstance = new MockRangeSliderView();
//   });
// });
