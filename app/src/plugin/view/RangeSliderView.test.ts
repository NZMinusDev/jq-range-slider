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

import RangeSliderView, { DEFAULT_OPTIONS, DEFAULT_STATE } from './RangeSliderView';

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

const differentConstructorArgs: DifferentArguments<ConstructorParameters<typeof RangeSliderView>> =
  {
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
        { isActiveThumbs: [false, false], value: [0, 75] },
      ],
    ],
  };

testDefaultOptions(RangeSliderView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderView,
  differentConstructorArgs,
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set('_options', 0).set('_state', 1),
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
      templateMock({ classInfo: {}, styleInfo: {}, attributes: {} });
      expect(templateMock).toHaveReturned();

      const getIntervalInfoByPointMock = jest.spyOn(
        Object.getPrototypeOf(instance),
        '_getIntervalInfoByPoint'
      );
      instance['_getIntervalInfoByPoint'](-200);
      expect(getIntervalInfoByPointMock).toHaveReturnedWith({ keyOfSupremum: 'min' });
      instance['_getIntervalInfoByPoint'](200);
      expect(getIntervalInfoByPointMock).toHaveReturnedWith({ keyOfInfimum: 'max' });
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
    differentArguments: differentConstructorArgs as DifferentArguments<
      [ConstructorParameters<typeof RangeSliderView>['0']]
    >,
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
      const intervals = { min: -1250, '80%': -500, '90%': 400, max: 1500 };
      const start = [-1150, -600, 1400];
      const padding = 100;
      const trackValueSize = intervals.max - intervals.min;
      const minTrackValue = intervals.min + padding;
      const maxTrackValue = intervals.max - padding;
      const trackPXSize = 100;
      const trackRatio = trackValueSize / 100;
      const valuePerPX = trackValueSize / trackPXSize;
      const movementToIncludeAllIntervalsForInnerThumb = 29;

      const trackElem = container.querySelector<HTMLElement>(
        '.js-range-slider__track'
      ) as HTMLElement;
      const pipsElement = container.querySelector('.js-range-slider__pips') as HTMLElement;
      const pipsValueElements = pipsElement.querySelectorAll<HTMLElement>(
        '.js-range-slider__pips-value'
      );
      const theMostLeftPipValue = pipsValueElements.item(0);
      const theMostRightPipValue = pipsValueElements.item(3);

      const thumbsElements = container.querySelectorAll<HTMLElement>('.js-range-slider__thumb');
      const originsElements = Array.from<HTMLElement>(thumbsElements).map((thumbElem) => {
        const originElem = thumbElem.closest('.js-range-slider__thumb-origin') as HTMLElement;

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

      const valueNowQualifiedName = 'aria-valuenow';

      const runThroughAllIntervals = (
        movementAcc: number,
        increment: number,
        expecters: ((newValue: number, valueBefore: number) => void)[],
        end = movementToIncludeAllIntervalsForInnerThumb
      ) => {
        if (Math.abs(movementAcc) < end - 1) {
          runThroughAllIntervals(movementAcc + increment, increment, expecters, end);
        }

        const valueBefore = +(innerThumb.getAttribute(valueNowQualifiedName) as string);
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: increment,
            bubbles: true,
          })
        );
        const newValue = +(innerThumb.getAttribute(valueNowQualifiedName) as string);

        let lowerValue = valueBefore;
        let greaterValue = newValue;

        if (increment < 0) {
          [lowerValue, greaterValue] = [greaterValue, lowerValue];
        }

        const isInsideTheFirstInterval =
          lowerValue >= minTrackValue && lowerValue < intervals['80%'];
        const isInsideTheSecondInterval =
          lowerValue >= intervals['80%'] && lowerValue < intervals['90%'];
        const isInsideTheThirdInterval =
          lowerValue >= intervals['90%'] && lowerValue < maxTrackValue;

        if (isInsideTheFirstInterval && greaterValue < intervals['80%']) {
          expecters[0](newValue, valueBefore);
        }

        if (isInsideTheSecondInterval && greaterValue < intervals['90%']) {
          expecters[1](newValue, valueBefore);
        }

        if (isInsideTheThirdInterval && greaterValue < maxTrackValue) {
          expecters[2](newValue, valueBefore);
        }
      };

      trackElem.getBoundingClientRect = () => ({
        width: trackPXSize,
        height: trackPXSize,
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
        expect(instance.get()).toMatchObject(start);

        instance.setOrientationOption('horizontal');
      });

      test('value should be calculated with taking into account non linear intervals', () => {
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        let movement = 1;

        const expecters = [
          (newValue, valueBefore) => {
            const range = intervals['80%'] - intervals.min;
            const percentSize = 80;

            expect(newValue - valueBefore).toBeCloseTo(
              (range / percentSize / trackRatio) * valuePerPX * movement
            );
          },
          (newValue, valueBefore) => {
            const range = intervals['90%'] - intervals['80%'];
            const percentSize = 10;

            expect(newValue - valueBefore).toBeCloseTo(
              (range / percentSize / trackRatio) * valuePerPX * movement
            );
          },
          (newValue, valueBefore) => {
            const range = intervals.max - intervals['90%'];
            const percentSize = 10;

            expect(newValue - valueBefore).toBeCloseTo(
              (range / percentSize / trackRatio) * valuePerPX * movement
            );
          },
        ];

        runThroughAllIntervals(0, movement, expecters);

        movement = -1;
        runThroughAllIntervals(0, movement, expecters);

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
            movementX: movementToIncludeAllIntervalsForInnerThumb,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -movementToIncludeAllIntervalsForInnerThumb,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute(valueNowQualifiedName) as string)).toBe(-600);

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test('step options should work', () => {
        const steps = [50, 1, 300];
        instance.setStepsOption([50, 'none', 300]);
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        const expecters = [
          (newValue, valueBefore) => {
            expect(Number.isInteger((newValue - valueBefore) / steps[0])).toBe(true);
          },
          (newValue, valueBefore) => {
            expect(Number.isInteger((newValue - valueBefore) / steps[1])).toBe(true);
          },
          (newValue, valueBefore) => {
            expect(Number.isInteger(Math.round(newValue - valueBefore) / steps[2])).toBe(true);
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

      test("repeated clicks on thumb shouldn't accumulate movement", () => {
        const initialValue = instance.get();

        const clickThumbRepeatedly = (clicks: number, movement: number) => {
          if (clicks > 0) clickThumbRepeatedly(clicks - 1, movement);

          innerThumb.dispatchEvent(
            new PointerEvent('pointerdown', {
              pointerId: 1,
              bubbles: true,
            })
          );
          innerThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 1,
              movementX: movement,
              bubbles: true,
            })
          );
          innerThumb.dispatchEvent(
            new PointerEvent('lostpointercapture', {
              pointerId: 1,
              bubbles: true,
            })
          );
        };

        clickThumbRepeatedly(10, 1);
        clickThumbRepeatedly(10, -1);

        instance.setStepsOption([50, 'none', 300]);

        clickThumbRepeatedly(10, 1);

        expect(instance.get()).toMatchObject(initialValue);

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
            movementX: trackPXSize,
            bubbles: true,
          })
        );
        expect(Number(originsElements[1].style.zIndex)).toBeGreaterThan(
          Number(originsElements[2].style.zIndex)
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -trackPXSize,
            bubbles: true,
          })
        );
        expect(Number(originsElements[1].style.zIndex)).toBeGreaterThan(
          Number(originsElements[0].style.zIndex)
        );

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
            movementX: trackPXSize,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute(valueNowQualifiedName) as string)).toBe(
          +(supremumThumb.getAttribute(valueNowQualifiedName) as string)
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -trackPXSize,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute(valueNowQualifiedName) as string)).toBe(
          +(infimumThumb.getAttribute(valueNowQualifiedName) as string)
        );

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: -trackPXSize,
            bubbles: true,
          })
        );
        expect(+(infimumThumb.getAttribute(valueNowQualifiedName) as string)).toBe(minTrackValue);

        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: trackPXSize,
            bubbles: true,
          })
        );
        expect(+(supremumThumb.getAttribute(valueNowQualifiedName) as string)).toBe(maxTrackValue);

        instance.setPaddingOption(0);
        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: -trackPXSize,
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
        expect(+(infimumThumb.getAttribute(valueNowQualifiedName) as string)).toBe(
          minTrackValue - padding
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: trackPXSize,
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
        expect(+(supremumThumb.getAttribute(valueNowQualifiedName) as string)).toBe(
          maxTrackValue + padding
        );
        instance.set();
        instance.setPaddingOption(padding);

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
        instance.set([-1000, start[1], 1300]);

        innerThumb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(instance['_state'].value).toStrictEqual([-1000, start[1], 1300]);

        trackElem.dispatchEvent(new MouseEvent('click', { clientX: -1 }));
        trackElem.dispatchEvent(
          new MouseEvent('click', {
            clientX: trackPXSize * 0.5,
          })
        );
        trackElem.dispatchEvent(new MouseEvent('click', { clientX: trackPXSize + 1 }));
        expect(instance['_state'].value.map((val) => Number(val.toFixed(2)))).toMatchObject([
          start[0],
          expect.any(Number),
          start[2],
        ]);

        instance.setOrientationOption('vertical');
        trackElem.dispatchEvent(new MouseEvent('click', { clientY: -1 }));
        trackElem.dispatchEvent(
          new MouseEvent('click', {
            clientY: trackPXSize * 0.5,
          })
        );
        expect(instance['_state'].value.map((val) => Number(val.toFixed(2)))).toMatchObject([
          start[0],
          expect.any(Number),
          start[2],
        ]);
        instance.setOrientationOption('horizontal');

        instance.set();
      });

      test('click on text of "valuable pip" should be handled', () => {
        instance.set([-1000, -600, 1300]);

        theMostLeftPipValue.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        theMostRightPipValue.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(instance['_state'].value.map((val) => Number(val.toFixed(2)))).toMatchObject(start);
      });

      test('click on marker of pips should not be handled', () => {
        const values = [-1000, -600, 1300];

        instance.set(values);

        (pipsElement.querySelector('.js-range-slider__pips-marker') as HTMLElement).dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );

        expect(instance['_state'].value).toStrictEqual(values);
      });

      test('nearest thumb should be calculated by ordered distance', () => {
        instance.set([-1000, -1000, -1000]);

        theMostLeftPipValue.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        theMostRightPipValue.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(instance['_state'].value.map((val) => Number(val.toFixed(2)))).toMatchObject([
          -1150, -1000, 1400,
        ]);
      });

      describe('cursor movement from exterior of track should not be handled', () => {
        instance.set();

        const movement = 10;

        test('with horizontal orientation', () => {
          infimumThumb.dispatchEvent(
            new PointerEvent('pointerdown', {
              pointerId: 1,
              bubbles: true,
            })
          );
          supremumThumb.dispatchEvent(
            new PointerEvent('pointerdown', {
              pointerId: 2,
              bubbles: true,
            })
          );

          infimumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 1,
              movementX: -movement,
              clientX: -movement,
              bubbles: true,
            })
          );
          infimumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 1,
              movementX: movement,
              clientX: 0,
              bubbles: true,
            })
          );

          supremumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 2,
              movementX: movement,
              clientX: trackPXSize + movement,
              bubbles: true,
            })
          );
          supremumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 2,
              movementX: -movement,
              clientX: trackPXSize,
              bubbles: true,
            })
          );

          infimumThumb.dispatchEvent(
            new PointerEvent('lostpointercapture', {
              pointerId: 1,
              bubbles: true,
            })
          );
          supremumThumb.dispatchEvent(
            new PointerEvent('lostpointercapture', {
              pointerId: 2,
              bubbles: true,
            })
          );

          instance.set();
        });

        test('with vertical orientation', () => {
          instance.setOrientationOption('vertical');

          infimumThumb.dispatchEvent(
            new PointerEvent('pointerdown', {
              pointerId: 1,
              bubbles: true,
            })
          );
          supremumThumb.dispatchEvent(
            new PointerEvent('pointerdown', {
              pointerId: 2,
              bubbles: true,
            })
          );

          infimumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 1,
              movementY: -movement,
              clientY: -movement,
              bubbles: true,
            })
          );
          infimumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 1,
              movementY: movement,
              clientY: 0,
              bubbles: true,
            })
          );

          supremumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 2,
              movementY: movement,
              clientY: trackPXSize + movement,
              bubbles: true,
            })
          );
          supremumThumb.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 2,
              movementY: -movement,
              clientY: trackPXSize,
              bubbles: true,
            })
          );

          infimumThumb.dispatchEvent(
            new PointerEvent('lostpointercapture', {
              pointerId: 1,
              bubbles: true,
            })
          );
          supremumThumb.dispatchEvent(
            new PointerEvent('lostpointercapture', {
              pointerId: 2,
              bubbles: true,
            })
          );

          instance.set();
          instance.setOrientationOption('horizontal');
        });
      });

      test('after options updated value calculating should be properly(with new arguments in formula)', () => {
        instance.setOptions({ intervals: { min: intervals.min, max: intervals.max * 10 } });

        supremumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );

        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: trackPXSize,
            bubbles: true,
          })
        );

        supremumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );

        const desiredValues = [...start];
        desiredValues[2] = intervals.max * 10 - padding;
        expect(instance.get()).toStrictEqual(desiredValues);

        instance.setOptions({ intervals: { min: intervals.min, max: intervals.max } });
      });
    },
  ],
});
