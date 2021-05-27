/* eslint-disable dot-notation */

import {
  InstancePropsExpecter,
  testInit,
  testDefaultOptions,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from '@utils/devTools/tools/UnitTestingHelper';

import RangeSliderView, { DEFAULT_OPTIONS, DEFAULT_STATE } from './range-slider.view';

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderView>,
  RangeSliderView
> = function viewPropertiesExpecter({ instance }) {
  expect(instance['_options'].connect.length).toBe(instance['_options'].start.length + 1);
  expect(instance['_options'].tooltips.length).toBe(instance['_options'].start.length);

  const [leftPad, rightPad] = instance['_options'].padding;
  instance['_options'].start.forEach((startValue, index) => {
    expect(startValue).toBeGreaterThanOrEqual(instance['_options'].intervals.min + leftPad);
    expect(startValue).toBeLessThanOrEqual(instance['_options'].intervals.max - rightPad);

    if (index > 0) {
      expect(startValue).toBeGreaterThanOrEqual(instance['_options'].start[index - 1]);
    }
  });

  switch (instance['_options'].pips.mode) {
    case 'count': {
      expect(instance['_options'].pips.values).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(instance['_options'].pips.values)).toBe(true);

      break;
    }
    case 'positions': {
      expect(instance['_options'].pips.values).toStrictEqual(
        (instance['_options'].pips.values as number[]).filter((value) => value >= 0 && value <= 100)
      );

      break;
    }
    case 'values': {
      expect(instance['_options'].pips.values).toStrictEqual(
        (instance['_options'].pips.values as number[]).filter(
          (value) =>
            value >= instance['_options'].intervals.min &&
            value <= instance['_options'].intervals.max
        )
      );

      break;
    }

    // no default
  }
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderView.prototype.setOptions
>> = {
  invalidOptionalArguments: [
    [{ intervals: { min: -100, max: 100, '50%': 50 }, start: [-50, 0, 75], connect: [] }],
    [{ intervals: { min: -100, max: 100, '50%': 50 }, start: [-50, 0, 75], connect: [true] }],
    [
      {
        intervals: { min: -100, max: 100, '50%': 50 },
        start: [-50, 0, 75],
        connect: [true, false, true, true, true, false],
      },
    ],
    [{ intervals: { min: -100, max: 100, '50%': 50 }, start: [-50, 0, 75], tooltips: [] }],
    [
      {
        intervals: { min: -100, max: 100, '50%': 50 },
        start: [-50, 0, 75],
        tooltips: [true, false],
      },
    ],
    [
      {
        intervals: { min: -100, max: 100, '50%': 50 },
        start: [-50, 0, 75],
        tooltips: [(val: number) => `${val}`, false, true, true, true, false],
      },
    ],
    [{ intervals: { min: -100, max: 100, '50%': 50 }, start: [] }],
    [{ intervals: { min: -100, max: 100, '50%': 50 }, start: [-101] }],
    [{ intervals: { min: -100, max: 100, '50%': 50 }, start: [101] }],
    [
      {
        intervals: { min: -100, max: 100, '50%': 50 },
        start: [-100, -90, 0, 100],
        padding: 5,
      },
    ],
    [{ intervals: { min: -100, max: 100, '50%': 50 }, start: [50, -50, -75, 0, 10] }],
    [{ pips: { mode: 'intervals', values: 5 } }],
    [{ pips: { mode: 'intervals', values: [0, 0, -10, 50, -99] } }],
    [{ pips: { mode: 'count', values: -3 } }],
    [{ pips: { mode: 'count', values: [0, 50, 100] } }],
    [{ pips: { mode: 'positions', values: 10 } }],
    [{ pips: { mode: 'positions', values: [-50, -1, 0, 99, 100, 101] } }],
    [{ pips: { mode: 'values', values: 2 } }],
    [
      {
        intervals: { min: -100, max: 100, '50%': 50 },
        pips: { mode: 'values', values: [-101, -100, 50, 99, 101] },
      },
    ],
    [{ steps: 5 }],
    [{ pips: { values: [] } }],
    [{ pips: { values: [50] } }],
    [{ pips: { mode: 'positions', values: 0 } }],
  ],
  partialOptionalArguments: [
    [
      {
        intervals: { min: -100, max: 100, '50%': 25 },
        start: [0, 75],
        steps: [10, 5],
        connect: [true, false, true],
        padding: [10, 5],
        tooltips: [true, false],
      },
    ],
  ],
  fullOptionalArguments: [
    [
      {
        intervals: { min: -100, max: 100, '50%': 50 },
        start: [0, 75],
        steps: [10, 5],
        connect: [false, true, false],
        orientation: 'vertical',
        padding: [10, 5],
        formatter: (number: number) => `${number.toFixed(2).toLocaleString()}$`,
        tooltips: [true, (number: number) => `${number.toFixed(4).toLocaleString()}%`],
        pips: { mode: 'count', values: 4, density: 5 },
      },
    ],
  ],
};

testDefaultOptions(RangeSliderView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderView,
  differentConstructorArgs: {
    validRequiredArguments: [[]],
    ...(differentOptionsArg as DifferentArguments<ConstructorParameters<typeof RangeSliderView>>),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 1),
});
describe('init', () => {
  describe("with start, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const options = new RangeSliderView({
        intervals: { min: -200, max: 200, '50%': -100 },
        start: -100,
        tooltips: false,
        connect: true,
      })['_options'];

      expect(options.start).toStrictEqual([-100]);
      expect(options.tooltips).toStrictEqual([false]);
      expect(options.connect).toStrictEqual([true, true]);
    });
  });
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeSliderView({
        intervals: { min: -100, max: 100 },
        start: [-50, 0, 50],
        tooltips: [() => ``, false, true],
      });

      const formatterMock = jest.fn(instance['_options'].formatter);
      formatterMock(10);
      expect(formatterMock).toHaveReturned();

      const templateMock = jest.fn(instance.template);
      templateMock();
      expect(templateMock).toHaveReturned();

      const _getIntervalInfoByPointMock = jest.spyOn(
        Object.getPrototypeOf(instance),
        '_getIntervalInfoByPoint'
      );
      instance['_getIntervalInfoByPoint'](-200);
      expect(_getIntervalInfoByPointMock).toHaveReturnedWith({ keyOfSupremum: 'min' });
      instance['_getIntervalInfoByPoint'](200);
      expect(_getIntervalInfoByPointMock).toHaveReturnedWith({ keyOfInfimum: 'max' });
    });
  });
});

testGetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.getOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    returns: '_options',
  },
});
testGetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.get,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    returns: '_state.value',
  },
});
testSetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.setOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});
describe('setOptions', () => {
  describe("with start, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const options = new RangeSliderView({
        intervals: { min: -2000, max: 2000, '50%': -1000, '75%': 1800 },
        start: [-100, -50, 0, 50],
        tooltips: [true, false, true, false],
        connect: [true, false, true, false, true],
      }).setOptions({
        start: -100,
        tooltips: false,
        connect: true,
      })['_options'];

      expect(options.start).toStrictEqual([-100, -100, -100, -100]);
      expect(options.tooltips).toStrictEqual([false, false, false, false]);
      expect(options.connect).toStrictEqual([true, true, true, true, true]);
    });
  });
});
testSetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype['_setState'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: { invalidOptionalArguments: [[{ value: undefined }]] },
  },
  propsToSet: new Map().set('_state', 0),
  resetPropsTo: new Map().set('_state', DEFAULT_STATE),
});
describe('_setState', () => {
  describe('with different lengths of value and isActiveThumbs', () => {
    test('the value and isActiveThumbs should have the same length', () => {
      const instance = new RangeSliderView(
        {
          start: [-50, 0, 50],
        },
        { value: [-5, 0, 5], isActiveThumbs: [false, false, false, false] }
      );

      expect(instance['_state'].value.length).toBe(instance['_state'].isActiveThumbs.length);

      instance['_setState']({ value: [-15, 0, 15], isActiveThumbs: [true] });

      expect(instance['_state'].value.length).toBe(instance['_state'].isActiveThumbs.length);
    });
  });
});
testSetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.set,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expecter: ({ mock, passedArgs, instance }) => {
      // some expect calls
    },
    differentArguments: { fullOptionalArguments: [[50], [[-10, 0, 10]]] },
  },
  propsToSet: new Map().set('_state.value.0', '0.0'),
  resetPropsTo: new Map().set('_state', DEFAULT_STATE),
});

testDOM({
  Creator: RangeSliderView,
  constructorsArgs: [
    [
      {
        intervals: { min: -1250, '80%': -500, '90%': 400, max: 1500 },
        start: [-1150, -600, 1400],
        padding: 100,
      },
    ],
  ],
  templatesArgs: [],
  callbacksWithTest: [
    ({ container, instance }) => {
      const INTERVALS = { min: -1250, '80%': -500, '90%': 400, max: 1500 };
      const START = [-1150, -600, 1400];
      const PADDING = 100;
      const TRACK_VALUE_SIZE = INTERVALS.max - INTERVALS.min;
      const MIN_TRACK_VALUE = INTERVALS.min + PADDING;
      const MAX_TRACK_VALUE = INTERVALS.max - PADDING;
      const TRACK_PX_SIZE = 100;
      const TRACK_RATIO = TRACK_VALUE_SIZE / 100;
      const VALUE_PER_PX = TRACK_VALUE_SIZE / TRACK_PX_SIZE;
      const MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB = 29;

      const trackElem = container.querySelector<HTMLElement>(
        '.js-range-slider__track'
      ) as HTMLElement;
      const pipsElement = container.querySelector('.js-range-slider__pips') as HTMLElement;
      const pipsValueElements = pipsElement.querySelectorAll<HTMLElement>(
        '.js-range-slider__pips-value'
      );

      const thumbsElements = container.querySelectorAll<HTMLElement>('.js-range-slider__thumb');
      const originsElements = Array.from<HTMLElement>(thumbsElements).map((thumbElem) => {
        const originElem = thumbElem.closest('.range-slider__thumb-origin') as HTMLElement;

        // https://github.com/jsdom/jsdom/pull/2666
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        originElem.setPointerCapture = function setPointerCapture(pointerId: number) {
          // it's noop
        };

        return originElem;
      });
      const infimumThumb = thumbsElements.item(0);
      const innerThumb = thumbsElements.item(1);
      const supremumThumb = thumbsElements.item(2);

      const VALUE_NOW_QUALIFIED_NAME = 'aria-valuenow';

      const runThroughAllIntervals = (
        movementAcc: number,
        increment: number,
        expecters: ((newValue: number, valueBefore: number) => void)[],
        end = MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB
      ) => {
        if (Math.abs(movementAcc) < end - 1) {
          runThroughAllIntervals(movementAcc + increment, increment, expecters, end);
        }

        const valueBefore = +(innerThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string);
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: increment,
            bubbles: true,
          })
        );
        const newValue = +(innerThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string);

        let lowerValue = valueBefore;
        let greaterValue = newValue;
        if (increment < 0) {
          [lowerValue, greaterValue] = [greaterValue, lowerValue];
        }

        const isInsideTheFirstInterval =
          lowerValue >= MIN_TRACK_VALUE && lowerValue < INTERVALS['80%'];
        const isInsideTheSecondInterval =
          lowerValue >= INTERVALS['80%'] && lowerValue < INTERVALS['90%'];
        const isInsideTheThirdInterval =
          lowerValue >= INTERVALS['90%'] && lowerValue < MAX_TRACK_VALUE;

        if (isInsideTheFirstInterval && greaterValue < INTERVALS['80%']) {
          expecters[0](newValue, valueBefore);
        }

        if (isInsideTheSecondInterval && greaterValue < INTERVALS['90%']) {
          expecters[1](newValue, valueBefore);
        }

        if (isInsideTheThirdInterval && greaterValue < MAX_TRACK_VALUE) {
          expecters[2](newValue, valueBefore);
        }
      };

      trackElem.getBoundingClientRect = () => ({
        width: TRACK_PX_SIZE,
        height: TRACK_PX_SIZE,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ``,
      });

      test('should be only one render for each pointermove where abs(movement) > 0', () => {
        const renderMock = jest.spyOn(Object.getPrototypeOf(instance), '_render');

        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: 10,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: 0,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -10,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );

        // +1 for _state.isActiveThumbs update when lostpointercapture
        expect(renderMock).toBeCalledTimes(3);

        renderMock.mockRestore();
      });

      test('vertical orientation should be supported', () => {
        instance.setOrientationOption('vertical');

        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementY: 10,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementY: -10,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
        expect(instance.get()).toMatchObject(START);

        instance.setOrientationOption('horizontal');
      });

      test('value should be calculated with taking into account non linear intervals', () => {
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        const increment = 1;
        const decrement = -1;

        const expecters = [
          (newValue, valueBefore) => {
            expect(newValue - valueBefore).toBeCloseTo(
              ((INTERVALS['80%'] - INTERVALS.min) / 80 / TRACK_RATIO) * VALUE_PER_PX * increment
            );
          },
          (newValue, valueBefore) => {
            expect(newValue - valueBefore).toBeCloseTo(
              ((INTERVALS['90%'] - INTERVALS['80%']) / 10 / TRACK_RATIO) * VALUE_PER_PX * increment
            );
          },
          (newValue, valueBefore) => {
            expect(newValue - valueBefore).toBeCloseTo(
              ((INTERVALS.max - INTERVALS['90%']) / 10 / TRACK_RATIO) * VALUE_PER_PX * increment
            );
          },
        ];

        runThroughAllIntervals(0, increment, expecters);
        runThroughAllIntervals(0, decrement, expecters);

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test('thumb move through several intervals should calculated with proper factor for each interval', () => {
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)).toBe(-600);

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test('step options should work', () => {
        const STEPS = [50, 1, 300];
        instance.setStepsOption([50, 'none', 300]);
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        const expecters = [
          (newValue, valueBefore) => {
            expect(Number.isInteger((newValue - valueBefore) / STEPS[0])).toBe(true);
          },
          (newValue, valueBefore) => {
            expect(Number.isInteger((newValue - valueBefore) / STEPS[1])).toBe(true);
          },
          (newValue, valueBefore) => {
            expect(Number.isInteger(Math.round(newValue - valueBefore) / STEPS[2])).toBe(true);
          },
        ];

        runThroughAllIntervals(0, 1, expecters);
        runThroughAllIntervals(0, -1, expecters);

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
        instance.set();
        instance.setStepsOption();
      });

      test('z-indexes of close to each other thumbs should be swapped for user friendly usage', () => {
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+originsElements[1].style.zIndex).toBeGreaterThan(+originsElements[2].style.zIndex);
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+originsElements[1].style.zIndex).toBeGreaterThan(+originsElements[0].style.zIndex);

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test('each thumb should be limited by sibling thumb or end of track', () => {
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );
        infimumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 2,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 3,
            bubbles: true,
          })
        );

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: 1,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: -1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)).toBe(
          +(supremumThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)).toBe(
          +(infimumThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)
        );

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: -TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(infimumThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)).toBe(
          MIN_TRACK_VALUE
        );

        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(supremumThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)).toBe(
          MAX_TRACK_VALUE
        );

        instance.setPaddingOption(0);
        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: -TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: -1,
            bubbles: true,
          })
        );
        expect(+(infimumThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)).toBe(
          MIN_TRACK_VALUE - PADDING
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: 1,
            bubbles: true,
          })
        );
        expect(+(supremumThumb.getAttribute(VALUE_NOW_QUALIFIED_NAME) as string)).toBe(
          MAX_TRACK_VALUE + PADDING
        );
        instance.set();
        instance.setPaddingOption(PADDING);

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
        infimumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 2,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 3,
            bubbles: true,
          })
        );
      });

      test('click on track should be handled', () => {
        instance.set([-1000, START[1], 1300]);

        innerThumb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(instance['_state'].value).toStrictEqual([-1000, START[1], 1300]);

        trackElem.dispatchEvent(new MouseEvent('click', { clientX: -1 }));
        trackElem.dispatchEvent(
          new MouseEvent('click', {
            clientX: TRACK_PX_SIZE * 0.5,
          })
        );
        trackElem.dispatchEvent(new MouseEvent('click', { clientX: TRACK_PX_SIZE + 1 }));
        expect(instance['_state'].value.map((val) => +val.toFixed(2))).toMatchObject([
          START[0],
          expect.any(Number),
          START[2],
        ]);

        instance.setOrientationOption('vertical');
        trackElem.dispatchEvent(new MouseEvent('click', { clientY: -1 }));
        trackElem.dispatchEvent(
          new MouseEvent('click', {
            clientY: TRACK_PX_SIZE * 0.5,
          })
        );
        expect(instance['_state'].value.map((val) => +val.toFixed(2))).toMatchObject([
          START[0],
          expect.any(Number),
          START[2],
        ]);
        instance.setOrientationOption('horizontal');

        instance.set();
      });

      test('click on valuable pip should be handled', () => {
        instance.set([-1000, -600, 1300]);

        (pipsElement.querySelector('.js-range-slider__pips-marker') as HTMLElement).dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
        expect(instance['_state'].value).toStrictEqual([-1000, -600, 1300]);

        pipsValueElements.item(0).dispatchEvent(new MouseEvent('click', { bubbles: true }));
        pipsValueElements.item(3).dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(instance['_state'].value.map((val) => +val.toFixed(2))).toMatchObject(START);
      });
    },
  ],
});
