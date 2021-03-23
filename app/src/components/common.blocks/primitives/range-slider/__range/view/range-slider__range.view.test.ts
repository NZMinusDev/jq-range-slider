import RangeSliderRangeView, { DEFAULT_OPTIONS } from "./range-slider__range.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
} from "@utils/devTools/tools/UnitTestingHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderRangeView>,
  RangeSliderRangeView
> = function ({ instance }) {};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderRangeView.prototype.setOptions
>> = {
  fullOptionalArguments: [[{ isConnected: true }]],
};

testInitDEFAULT_OPTIONS(
  RangeSliderRangeView,
  [document.createElement("div"), DEFAULT_OPTIONS],
  viewPropertiesExpecter
);

testInit({
  Creator: RangeSliderRangeView,
  differentConstructorArgs: {
    validRequiredArguments: [[document.createElement("div")]],
    ...(differentOptionsArg as DifferentArguments<
      ConstructorParameters<typeof RangeSliderRangeView>
    >),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("dom.self", 0).set("_options", 1),
});

testGetter({
  Creator: RangeSliderRangeView,
  constructorArgs: [document.createElement("div")],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderRangeView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testSetter({
  Creator: RangeSliderRangeView,
  constructorArgs: [document.createElement("div")],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderRangeView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});
