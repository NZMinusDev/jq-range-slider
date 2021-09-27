import {
  InstancePropsExpecter,
  testInit,
  testDefaultOptions,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from '@utils/devTools/scripts/UnitTestingHelper';
import { collapsingParseInt } from '@utils/devTools/scripts/ParserHelper';

import PipsView, { DEFAULT_OPTIONS } from './PipsView';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof PipsView>,
  PipsView
> = function viewPropertiesExpecter({ instance }) {
  instance['_options'].values.forEach((value, index, self) => {
    if (index > 0) {
      expect(value.percent > self[index - 1].percent);
    }

    expect(value.percent).toBeGreaterThanOrEqual(0);
    expect(value.percent).toBeLessThanOrEqual(100);
  });

  expect(instance['_options'].density).toBeGreaterThanOrEqual(0);
  expect(instance['_options'].density).toEqual(
    collapsingParseInt(`${instance['_options'].density}`)
  );
};

const differentConstructorArgs: DifferentArguments<
  ConstructorParameters<typeof PipsView>
> = {
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
        orientation: 'horizontal',
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
      {},
    ],
  ],
};

testDefaultOptions(PipsView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: PipsView,
  differentConstructorArgs,
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 0).set('_state', 1),
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new PipsView();

      const formatterMock = jest.fn(instance['_options'].formatter);
      formatterMock(1);
      expect(formatterMock).toHaveReturned();

      const templateMock = jest.fn(instance.template);
      templateMock();
      templateMock({ classInfo: {}, styleInfo: {}, attributes: {} });
      expect(templateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: PipsView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: PipsView.prototype.getOptions,
    expecter: () => {
      // some expect calls
    },
    returns: '_options',
  },
});
testSetter({
  Creator: PipsView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: PipsView.prototype.setOptions,
    expecter: () => {
      // some expect calls
    },
    differentArguments: differentConstructorArgs as DifferentArguments<
      [ConstructorParameters<typeof PipsView>[0]]
    >,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});

testDOM({
  Creator: PipsView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [],
});
