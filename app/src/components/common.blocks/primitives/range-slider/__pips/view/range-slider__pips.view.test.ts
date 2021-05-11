import RangeSliderPipsView, { DEFAULT_OPTIONS } from "./range-slider__pips.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from "@utils/devTools/tools/UnitTestingHelper";
import { collapsingParseInt } from "@utils/devTools/tools/ParserHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderPipsView>,
  RangeSliderPipsView
> = function ({ instance }) {
  instance["_options"].values.forEach((value, index, self) => {
    if (index > 0) expect(value.percent > self[index - 1].percent);
    expect(value.percent).toBeGreaterThanOrEqual(0);
    expect(value.percent).toBeLessThanOrEqual(100);
  });

  expect(instance["_options"].density).toBeGreaterThanOrEqual(0);
  expect(instance["_options"].density).toEqual(
    collapsingParseInt(`${instance["_options"].density}`)
  );
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderPipsView.prototype.setOptions
>> = {
  invalidOptionalArguments: [
    [
      {
        values: [
          { value: 0, percent: 9 },
          { value: -100, percent: 81 },
          { value: 100, percent: 100 },
          { value: 20, percent: 92.72 },
          { value: -1000, percent: 0 },
        ],
      },
    ],
    [
      {
        values: [
          { value: 0, percent: -10 },
          { value: 100, percent: 101 },
        ],
      },
    ],
    [{ density: -5 }],
    [{ density: 5.5543 }],
  ],
  partialOptionalArguments: [
    [
      {
        values: [
          { value: -100, percent: 0 },
          { value: 0, percent: 50 },
          { value: 100, percent: 100 },
        ],
      },
    ],
  ],
  fullOptionalArguments: [
    [
      {
        orientation: "horizontal",
        isHidden: true,
        values: [
          { value: -200, percent: 0 },
          { value: 0, percent: 66.66 },
          { value: 10, percent: 70 },
          { value: 100, percent: 100 },
        ],
        density: 2,
        formatter: (value: number) => `${value.toString()}$`,
      },
    ],
  ],
};

testInitDEFAULT_OPTIONS(RangeSliderPipsView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderPipsView,
  differentConstructorArgs: {
    validRequiredArguments: [[]],
    ...(differentOptionsArg as DifferentArguments<
      ConstructorParameters<typeof RangeSliderPipsView>
    >),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("_options", 1),
});
describe("init", () => {
  describe("with default options", () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeSliderPipsView();

      const formatterMock = jest.fn(instance["_options"].formatter);
      formatterMock(1);
      expect(formatterMock).toHaveReturned();

      const templateMock = jest.fn(instance.template);
      templateMock();
      expect(templateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: RangeSliderPipsView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderPipsView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testSetter({
  Creator: RangeSliderPipsView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderPipsView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});

testDOM({
  Creator: RangeSliderPipsView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});
