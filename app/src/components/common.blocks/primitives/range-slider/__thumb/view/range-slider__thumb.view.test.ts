import RangeSliderThumbView, { DEFAULT_OPTIONS } from "./range-slider__thumb.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
} from "@utils/devTools/tools/UnitTestingHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderThumbView>,
  RangeSliderThumbView
> = function ({ instance }) {
  expect(instance["_id"]).toBeGreaterThanOrEqual(0);

  expect(instance["_options"].start).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
  expect(instance["_options"].start).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderThumbView.prototype.setOptions
>> = {
  invalidOptionalArguments: [
    [{ start: Infinity }],
    [{ start: Number.MAX_SAFE_INTEGER + 1 }],
    [{ start: Number.MIN_SAFE_INTEGER - 1 }],
  ],
  fullOptionalArguments: [
    [
      {
        start: 5000,
      },
    ],
  ],
};

testInitDEFAULT_OPTIONS(RangeSliderThumbView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderThumbView,
  differentConstructorArgs: {
    validRequiredArguments: [[]],
    ...(differentOptionsArg as DifferentArguments<
      ConstructorParameters<typeof RangeSliderThumbView>
    >),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("_options", 1),
});

testGetter({
  Creator: RangeSliderThumbView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderThumbView.prototype.getId,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_id",
  },
});
testGetter({
  Creator: RangeSliderThumbView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderThumbView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testSetter({
  Creator: RangeSliderThumbView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderThumbView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});
