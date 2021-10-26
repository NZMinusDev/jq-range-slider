import {
  InstancePropsExpecter,
  testInit,
  testDefaultOptions,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from '@shared/utils/scripts/UnitTestingHelper';

import RangeView, { DEFAULT_OPTIONS } from './RangeView';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeView>,
  RangeView
> = function viewPropertiesExpecter() {
  // some expect calls
};

const differentConstructorArgs: DifferentArguments<
  ConstructorParameters<typeof RangeView>
> = {
  fullOptionalArguments: [[{ isConnected: true }, {}]],
};

testDefaultOptions(RangeView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeView,
  differentConstructorArgs,
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 0).set('_state', 1),
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeView();

      const templateMock = jest.fn(instance.template);
      templateMock();
      templateMock({ classInfo: {}, styleInfo: {}, attributes: {} });
      expect(templateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: RangeView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeView.prototype.getOptions,
    expecter: () => {
      // some expect calls
    },
    returns: '_options',
  },
});
testSetter({
  Creator: RangeView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeView.prototype.setOptions,
    expecter: () => {
      // some expect calls
    },
    differentArguments: differentConstructorArgs as DifferentArguments<
      [ConstructorParameters<typeof RangeView>['0']]
    >,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});

testDOM({
  Creator: RangeView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});
