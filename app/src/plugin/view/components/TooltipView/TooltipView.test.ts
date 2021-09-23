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

import TooltipView, { DEFAULT_OPTIONS } from './TooltipView';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof TooltipView>,
  TooltipView
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = function viewPropertiesExpecter({ instance, passedArgs }) {
  // some expect calls
};

const differentConstructorArgs: DifferentArguments<
  ConstructorParameters<typeof TooltipView>
> = {
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

testDefaultOptions(TooltipView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: TooltipView,
  differentConstructorArgs,
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 0).set('_state', 1),
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new TooltipView();

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
  Creator: TooltipView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: TooltipView.prototype.getOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    returns: '_options',
  },
});
testSetter({
  Creator: TooltipView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: TooltipView.prototype.setOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: differentConstructorArgs as DifferentArguments<
      [ConstructorParameters<typeof TooltipView>['0']]
    >,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});

testDOM({
  Creator: TooltipView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});
