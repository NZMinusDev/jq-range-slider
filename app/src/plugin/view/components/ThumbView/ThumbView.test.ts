import {
  InstancePropsExpecter,
  testInit,
  testDefaultOptions,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from '@utils/devTools/scripts/UnitTestingHelper';

import ThumbView, { DEFAULT_OPTIONS } from './ThumbView';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof ThumbView>,
  ThumbView
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = function viewPropertiesExpecter({ instance, passedArgs }) {
  // some expect calls
};

const differentConstructorArgs: DifferentArguments<
  ConstructorParameters<typeof ThumbView>
> = {};

testDefaultOptions(ThumbView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: ThumbView,
  differentConstructorArgs,
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 0).set('_state', 1),
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new ThumbView();

      const templateMock = jest.fn(instance.template);
      templateMock();
      templateMock({ classInfo: {}, styleInfo: {}, attributes: {} });
      expect(templateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: ThumbView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: ThumbView.prototype.getOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    returns: '_options',
  },
});
testSetter({
  Creator: ThumbView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: ThumbView.prototype.setOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: differentConstructorArgs as DifferentArguments<
      [ConstructorParameters<typeof ThumbView>['0']]
    >,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});

testDOM({
  Creator: ThumbView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [
    ({ container, instance }) => {
      test('ondragstart should be nooped', () => {
        const target = container.querySelector(
          '.js-range-slider__thumb'
        ) as HTMLElement;
        const event = new Event('dragstart');
        const noopMock = jest.spyOn(
          Object.getPrototypeOf(instance),
          '_onDragstart'
        );

        target.dispatchEvent(event);

        expect(noopMock).toBeCalled();

        noopMock.mockRestore();
      });
    },
  ],
});
