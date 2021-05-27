import {
  InstancePropsExpecter,
  testInit,
  testDefaultOptions,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from '@utils/devTools/tools/UnitTestingHelper';

import RangeSliderThumbView, { DEFAULT_OPTIONS } from './range-slider__thumb.view';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderThumbView>,
  RangeSliderThumbView
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = function viewPropertiesExpecter({ instance, passedArgs }) {
  // some expect calls
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderThumbView.prototype.setOptions
>> = {
  invalidOptionalArguments: [],
  fullOptionalArguments: [],
};

testDefaultOptions(RangeSliderThumbView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderThumbView,
  differentConstructorArgs: {
    validRequiredArguments: [[]],
    ...(differentOptionsArg as DifferentArguments<
      ConstructorParameters<typeof RangeSliderThumbView>
    >),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 1),
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeSliderThumbView();

      const templateMock = jest.fn(instance.template);
      templateMock();
      expect(templateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: RangeSliderThumbView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderThumbView.prototype.getOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    returns: '_options',
  },
});
testSetter({
  Creator: RangeSliderThumbView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderThumbView.prototype.setOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});

testDOM({
  Creator: RangeSliderThumbView,
  constructorsArgs: [],
  templatesArgs: [],
  callbacksWithTest: [
    ({ container, instance }) => {
      test('ondragstart should be nooped', () => {
        const target = container.querySelector('.js-range-slider__thumb') as HTMLElement;
        const event = new Event('dragstart');
        const noopMock = jest.spyOn(Object.getPrototypeOf(instance), '_onDragstart');

        target.dispatchEvent(event);

        expect(noopMock).toBeCalled();

        noopMock.mockRestore();
      });
    },
  ],
});
