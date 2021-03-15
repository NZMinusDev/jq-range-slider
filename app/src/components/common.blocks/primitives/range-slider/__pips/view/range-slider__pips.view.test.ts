import RangeSliderPipsView, { DEFAULT_OPTIONS } from "./range-slider__pips.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
} from "@utils/devTools/tools/UnitTestingHelper";
import { collapsingParseInt } from "@utils/devTools/tools/ParserHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderPipsView>,
  RangeSliderPipsView
> = function ({ instance }) {
  expect(instance["_options"].amount).toBeGreaterThanOrEqual(2);
  expect(instance["_options"].amount).toEqual(collapsingParseInt(`${instance["_options"].amount}`));

  expect(instance["_options"].density).toBeGreaterThanOrEqual(0);
  expect(instance["_options"].density).toEqual(
    collapsingParseInt(`${instance["_options"].density}`)
  );

  const formatterMock = jest.fn(instance["_options"].formatter);
  formatterMock(1);
  expect(formatterMock).toHaveReturned();
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderPipsView.prototype.setOptions
>> = {
  invalidOptionalArguments: [[{ amount: -2, density: 5.5543 }], [{ amount: 4.89, density: -5 }]],
  partialOptionalArguments: [[{ mode: "count", amount: 3 }]],
  fullOptionalArguments: [
    [
      {
        mode: "count",
        amount: 4,
        density: 6,
        formatter: (value: number) => `${value.toString()}$`,
      },
    ],
  ],
};

testInitDEFAULT_OPTIONS(
  RangeSliderPipsView,
  [document.createElement("div"), DEFAULT_OPTIONS],
  viewPropertiesExpecter
);

testInit({
  Creator: RangeSliderPipsView,
  differentConstructorArgs: {
    validRequiredArguments: [[document.createElement("div")]],
    ...(differentOptionsArg as DifferentArguments<
      ConstructorParameters<typeof RangeSliderPipsView>
    >),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("dom.self", 0).set("_options", 1),
});

testGetter({
  Creator: RangeSliderPipsView,
  constructorArgs: [document.createElement("div")],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderPipsView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testSetter({
  Creator: RangeSliderPipsView,
  constructorArgs: [
    document.createElement("div"),
    {
      mode: "count",
      amount: 5,
      density: 3,
      formatter: (value: number) => `${value.toString()}%$`,
    },
  ],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderPipsView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});
