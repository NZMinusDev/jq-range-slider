/* eslint-disable dot-notation */

import {
  InstancePropsExpecter,
  testInit,
  testDefaultOptions,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from '@utils/devTools/scripts/UnitTestingHelper';

import RangeSliderTooltipView, { DEFAULT_OPTIONS } from './range-slider__tooltip.view';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderTooltipView>,
  RangeSliderTooltipView
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = function viewPropertiesExpecter({ instance, passedArgs }) {
  // some expect calls
};

const differentConstructorArgs: DifferentArguments<ConstructorParameters<
  typeof RangeSliderTooltipView
>> = {
  partialOptionalArguments: [[{ isHidden: true }]],
  fullOptionalArguments: [
    [
      {
        orientation: 'top',
        formatter: (value: number) => `${value.toFixed(0).toLocaleString()}$`,
        isHidden: true,
      },
      { value: 0 },
    ],
  ],
};

testDefaultOptions(RangeSliderTooltipView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderTooltipView,
  differentConstructorArgs,
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 0).set('_state', 1),
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeSliderTooltipView();

      const formatterMock = jest.fn(instance['_options'].formatter);
      formatterMock(12.345);
      expect(formatterMock).toHaveReturned();

      const templateMock = jest.fn(instance.template);
      templateMock();
      templateMock({ classInfo: {}, styleInfo: {}, attributes: {} });
      expect(templateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: RangeSliderTooltipView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderTooltipView.prototype.getOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    returns: '_options',
  },
});
testSetter({
  Creator: RangeSliderTooltipView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderTooltipView.prototype.setOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: differentConstructorArgs as DifferentArguments<
      [ConstructorParameters<typeof RangeSliderTooltipView>['0']]
    >,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});

testDOM({
  Creator: RangeSliderTooltipView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});
