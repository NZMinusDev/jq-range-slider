import {
  InstancePropsExpecter,
  testInit,
  testDefaultOptions,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from '@utils/devTools/scripts/UnitTestingHelper';

import RangeSliderRangeView, { DEFAULT_OPTIONS } from './range-slider__range.view';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderRangeView>,
  RangeSliderRangeView
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = function viewPropertiesExpecter({ instance, passedArgs }) {
  // some expect calls
};

const differentConstructorArgs: DifferentArguments<ConstructorParameters<
  typeof RangeSliderRangeView
>> = {
  fullOptionalArguments: [[{ isConnected: true }, {}]],
};

testDefaultOptions(RangeSliderRangeView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderRangeView,
  differentConstructorArgs,
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 0).set('_state', 1),
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeSliderRangeView();

      const templateMock = jest.fn(instance.template);
      templateMock();
      templateMock({ classInfo: {}, styleInfo: {}, attributes: {} });
      expect(templateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: RangeSliderRangeView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderRangeView.prototype.getOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    returns: '_options',
  },
});
testSetter({
  Creator: RangeSliderRangeView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderRangeView.prototype.setOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: differentConstructorArgs as DifferentArguments<
      [ConstructorParameters<typeof RangeSliderRangeView>['0']]
    >,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});

testDOM({
  Creator: RangeSliderRangeView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});
