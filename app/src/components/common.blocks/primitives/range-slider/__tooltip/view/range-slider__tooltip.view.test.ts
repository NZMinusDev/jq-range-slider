import RangeSliderTooltipView, { DEFAULT_OPTIONS } from "./range-slider__tooltip.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from "@utils/devTools/tools/UnitTestingHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderTooltipView>,
  RangeSliderTooltipView
> = function ({ instance }) {
  const formatterMock = jest.fn(instance["_options"].formatter);
  formatterMock(12.345);
  expect(formatterMock).toHaveReturned();
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderTooltipView.prototype.setOptions
>> = {
  partialOptionalArguments: [[{ isHidden: true }]],
  fullOptionalArguments: [
    [
      {
        formatter: (value: number) => `${value.toFixed(0).toLocaleString()}$`,
        isHidden: true,
      },
    ],
  ],
};

testInitDEFAULT_OPTIONS(RangeSliderTooltipView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderTooltipView,
  differentConstructorArgs: {
    validRequiredArguments: [[]],
    ...(differentOptionsArg as DifferentArguments<
      ConstructorParameters<typeof RangeSliderTooltipView>
    >),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("_options", 1),
});

testGetter({
  Creator: RangeSliderTooltipView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderTooltipView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testSetter({
  Creator: RangeSliderTooltipView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderTooltipView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});

testDOM({
  Creator: RangeSliderTooltipView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});
