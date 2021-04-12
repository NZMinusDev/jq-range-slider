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
import { collapsingParseInt, getPrecision } from "@utils/devTools/tools/ParserHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderPipsView>,
  RangeSliderPipsView
> = function ({ instance }) {
  instance["_options"].values.forEach((value, index, self) => {
    if (index > 0) expect(value > self[index - 1]);
    expect(getPrecision(value)).toBeLessThanOrEqual(2);
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
    [{ values: [0, -100, 100, 20, -1000], density: -5 }],
    [{ values: [20.543543, 300.5811], density: 5.5543 }],
  ],
  partialOptionalArguments: [[{ values: [-100, 0, 100] }]],
  fullOptionalArguments: [
    [
      {
        isHidden: true,
        values: [-200, 0, 10, 100],
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
