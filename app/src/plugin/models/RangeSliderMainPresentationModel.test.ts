import {
  InstancePropsExpecter,
  DifferentArguments,
  testDefaultOptions,
  testInit,
  testGetter,
  testSetter,
} from '@shared/utils/scripts/testing/unit';
import {
  collapsingParseInt,
  collapsingParseFloat,
} from '@shared/utils/scripts/parser';

import RangeSliderMainPresentationModel from './RangeSliderMainPresentationModel';
import { DEFAULT_OPTIONS, DEFAULT_STATE } from './constants';

const instanceIntervalsOptionsExpecter = (
  options: ReturnType<RangeSliderMainPresentationModel['getOptions']>,
  keysOfIntervals: string[]
) => {
  const [leftPad, rightPad] = options.padding;

  keysOfIntervals.forEach((key, index, keys) => {
    switch (key) {
      case 'min': {
        expect(index).toBe(0);

        break;
      }
      case 'max': {
        expect(index).toBe(keys.length - 1);

        break;
      }
      default: {
        const parsedKey = collapsingParseFloat(key);
        const previousParsedKey = collapsingParseFloat(keys[index - 1]);

        expect(key).toBe(`${parsedKey}%`);
        expect(parsedKey).toBeGreaterThan(0);
        expect(parsedKey).toBeLessThan(100);
        expect(parsedKey).toBeGreaterThanOrEqual(previousParsedKey);

        break;
      }
    }

    if (index > 0) {
      expect(options.intervals[key]).toBeGreaterThanOrEqual(
        options.intervals[keys[index - 1]]
      );
    }

    if (index < options.steps.length && options.steps[index] !== 'none') {
      expect(options.steps[index]).toBeGreaterThan(0);

      expect(options.steps[index]).toBeLessThanOrEqual(
        Math.abs(
          options.intervals[key] - options.intervals[keysOfIntervals[index + 1]]
        ) -
          (index === 0 ? leftPad : 0) -
          (index === keys.length - 2 ? rightPad : 0)
      );
    }
  });
};

const instancePropsExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderMainPresentationModel>,
  RangeSliderMainPresentationModel
> = ({ instance }) => {
  const options = instance.getOptions();
  const keysOfIntervals = Object.keys(options.intervals).sort((a, b) => {
    if (a === 'min' || b === 'max') {
      return -1;
    }

    if (a === 'max' || b === 'min') {
      return 1;
    }

    return collapsingParseFloat(a) - collapsingParseFloat(b);
  });

  expect(options.steps.length).toBe(keysOfIntervals.length - 1);
  expect(options.connect.length).toBe(options.start.length + 1);
  expect(options.tooltips.length).toBe(options.start.length);

  expect(options.intervals.min).toBeLessThan(options.intervals.max);
  expect(options.intervals.min).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
  expect(options.intervals.max).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);

  instanceIntervalsOptionsExpecter(options, keysOfIntervals);

  options.padding.forEach((pad) => {
    expect(pad).toBeLessThanOrEqual(
      Math.abs(
        (options.intervals[keysOfIntervals[keysOfIntervals.length - 1]] -
          options.intervals[keysOfIntervals[0]]) /
          2
      )
    );
  });

  const [leftPad, rightPad] = options.padding;
  options.start.forEach((startValue, index) => {
    expect(startValue).toBeGreaterThanOrEqual(options.intervals.min + leftPad);
    expect(startValue).toBeLessThanOrEqual(options.intervals.max - rightPad);

    if (index > 0) {
      expect(startValue).toBeGreaterThanOrEqual(options.start[index - 1]);
    }
  });

  switch (options.pips.mode) {
    case 'count': {
      expect(options.pips.values).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(options.pips.values)).toBe(true);

      break;
    }
    case 'positions': {
      expect(options.pips.values).toStrictEqual(
        (options.pips.values as number[]).filter(
          (value) => value >= 0 && value <= 100
        )
      );

      break;
    }
    case 'values': {
      expect(options.pips.values).toStrictEqual(
        (options.pips.values as number[]).filter(
          (value) =>
            value >= options.intervals.min && value <= options.intervals.max
        )
      );

      break;
    }

    // no default
  }

  expect(options.pips.density).toBeGreaterThanOrEqual(0);
  expect(options.pips.density).toBeLessThanOrEqual(3);
  expect(options.pips.density).toEqual(
    collapsingParseInt(`${options.pips.density}`)
  );
};

const differentConstructorArgs: DifferentArguments<
  ConstructorParameters<typeof RangeSliderMainPresentationModel>
> = {
  invalidOptionalArguments: [
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          steps: [10, 15, 20, 1, 5],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          steps: [-10, 0],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          steps: [300, 500],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          steps: [5.543543, 10.54876],
        },
      },
    ],
    [{ options: { intervals: { min: -100, max: 100, '50%': 50 }, steps: [] } }],
    [
      {
        options: { intervals: { min: -100, max: 100, '50%': 50 }, steps: [10] },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          padding: 10,
          steps: [150, 50],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-50, 0, 75],
          connect: [],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-50, 0, 75],
          connect: [true],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-50, 0, 75],
          connect: [true, false, true, true, true, false],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-50, 0, 75],
          tooltips: [],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-50, 0, 75],
          tooltips: [true, false],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-50, 0, 75],
          tooltips: [(val: number) => `${val}`, false, true, true, true, false],
        },
      },
    ],
    [{ options: { intervals: { min: 100, max: 100 } } }],
    [{ options: { intervals: { min: 100, max: 99 } } }],
    [{ options: { intervals: { min: -100, max: -110 } } }],
    [
      {
        options: {
          intervals: {
            min: Number.MIN_SAFE_INTEGER - 1,
            max: Number.MAX_SAFE_INTEGER + 1,
          },
        },
      },
    ],
    [{ options: { intervals: { min: -100, max: 100, 50: 50 } } }],
    [{ options: { intervals: { min: -100, max: 100, '0%': 50 } } }],
    [{ options: { intervals: { min: -100, max: 100, '-1%': 50 } } }],
    [{ options: { intervals: { min: -100, max: 100, '100%': 50 } } }],
    [{ options: { intervals: { min: -100, max: 100, '101%': 50 } } }],
    [{ options: { intervals: { min: -100, max: 100, '50.23436123%': 50 } } }],
    [{ options: { intervals: { min: -100, max: 100, 'str5dsa%hgf': 50 } } }],
    [
      {
        options: {
          intervals: { min: -100.4532543, max: 100.897987, '50%': 50.74563 },
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: 100, max: -100, '25%': 50, '50%': 10, '75%': -50 },
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          padding: -10,
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          padding: 249,
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          padding: 10.76589645,
        },
      },
    ],
    [{ options: { intervals: { min: -100, max: 100, '50%': 50 }, start: [] } }],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-101],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [101],
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [-100, -90, 0, 100],
          padding: 5,
        },
      },
    ],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [50, -50, -75, 0, 10],
        },
      },
    ],
    [{ options: { pips: { mode: 'intervals', values: 5 } } }],
    [
      {
        options: { pips: { mode: 'intervals', values: [0, 0, -10, 50, -99] } },
      },
    ],
    [{ options: { pips: { mode: 'count', values: -3 } } }],
    [{ options: { pips: { mode: 'count', values: [0, 50, 100] } } }],
    [{ options: { pips: { mode: 'positions', values: 10 } } }],
    [
      {
        options: {
          pips: { mode: 'positions', values: [-50, -1, 0, 99, 100, 101] },
        },
      },
    ],
    [{ options: { pips: { mode: 'values', values: 2 } } }],
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          pips: { mode: 'values', values: [-101, -100, 50, 99, 101] },
        },
      },
    ],
    [{ options: { steps: 5 } }],
    [{ options: { pips: { values: [] } } }],
    [{ options: { pips: { values: [50] } } }],
    [{ options: { pips: { mode: 'positions', values: 0 } } }],
    [{ options: { pips: { density: -5 } } }],
    [{ options: { pips: { density: 4 } } }],
    [{ options: { pips: { density: 2.5543 } } }],
  ],
  partialOptionalArguments: [
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 25 },
          start: [0, 75],
          steps: [10, 5],
          connect: [true, false, true],
          padding: [10, 5],
          tooltips: [true, false],
        },
      },
    ],
  ],
  fullOptionalArguments: [
    [
      {
        options: {
          intervals: { min: -100, max: 100, '50%': 50 },
          start: [0, 75],
          steps: [10, 5],
          connect: [false, true, false],
          orientation: 'vertical',
          padding: [10, 5],
          formatter: (number: number) =>
            `${number.toFixed(2).toLocaleString()}$`,
          tooltips: [
            true,
            (number: number) => `${number.toFixed(4).toLocaleString()}%`,
          ],
          pips: { mode: 'count', values: 4, density: 3, isHidden: false },
        },
        facadeModel: {
          async getState() {
            return { value: [] };
          },
          async setState() {
            return this;
          },
          whenStateIsChanged() {},
          closeConnections() {
            return this;
          },
        },
      },
    ],
  ],
};

testDefaultOptions(
  RangeSliderMainPresentationModel,
  [{ options: DEFAULT_OPTIONS }],
  instancePropsExpecter
);

testInit({
  Creator: RangeSliderMainPresentationModel,
  differentConstructorArgs,
  instancePropsExpecter,
  propsToSet: new Map().set('_options', '0.options'),
});
describe('init', () => {
  describe("with start, steps, padding, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const options = new RangeSliderMainPresentationModel({
        options: {
          intervals: { min: -200, max: 200, '50%': -100 },
          start: -100,
          steps: 2,
          padding: 20,
          tooltips: false,
          connect: true,
        },
      }).getOptions();

      expect(options.start).toStrictEqual([-100]);
      expect(options.steps).toStrictEqual([2, 2]);
      expect(options.padding).toStrictEqual([20, 20]);
      expect(options.tooltips).toStrictEqual([false]);
      expect(options.connect).toStrictEqual([true, true]);
    });
  });
});
describe('init', () => {
  describe('with default options', () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeSliderMainPresentationModel({
        options: {
          intervals: { min: -100, max: 100 },
          start: [-50, 0, 50],
          tooltips: [() => ``, false, true],
        },
      });
      const options = instance.getOptions();

      const formatterMock = jest.fn(options.formatter);
      formatterMock(10);
      expect(formatterMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: RangeSliderMainPresentationModel,
  constructorArgs: [],
  instancePropsExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderMainPresentationModel.prototype.getOptions,
    expecter: () => {
      // some expect calls
    },
    returns: '_options',
  },
});
testGetter({
  Creator: RangeSliderMainPresentationModel,
  constructorArgs: [],
  instancePropsExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderMainPresentationModel.prototype.getState,
    expecter: () => {
      // some expect calls
    },
    returns: '_state',
  },
});

testSetter({
  Creator: RangeSliderMainPresentationModel,
  constructorArgs: [],
  instancePropsExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderMainPresentationModel.prototype.setOptions,
    expecter: () => {
      // some expect calls
    },
    differentArguments: Object.fromEntries(
      Object.entries(differentConstructorArgs).map(
        ([argsType, differentArgs]) => {
          const options = differentArgs.map((args) => args[0]?.options);

          return [argsType, options];
        }
      )
    ),
  },
  propsToSet: new Map().set('_options', 0),
  resetPropsTo: new Map().set('_options', DEFAULT_OPTIONS),
});
describe('setOptions', () => {
  describe("with start, steps, padding, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const options = new RangeSliderMainPresentationModel({
        options: {
          intervals: { min: -2000, max: 2000, '50%': -1000, '75%': 1800 },
          start: [-100, -50, 0, 50],
          steps: [10, 15, 20],
          padding: [30, 45],
          tooltips: [true, false, true, false],
          connect: [true, false, true, false, true],
        },
      })
        .setOptions({
          start: -100,
          steps: 2,
          padding: 20,
          tooltips: false,
          connect: true,
        })
        .getOptions();

      expect(options.start).toStrictEqual([-100, -100, -100, -100]);
      expect(options.steps).toStrictEqual([2, 2, 2]);
      expect(options.padding).toStrictEqual([20, 20]);
      expect(options.tooltips).toStrictEqual([false, false, false, false]);
      expect(options.connect).toStrictEqual([true, true, true, true, true]);
    });
  });
});
testSetter({
  Creator: RangeSliderMainPresentationModel,
  constructorArgs: [],
  instancePropsExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderMainPresentationModel.prototype.setState,
    expecter: () => {
      // some expect calls
    },
  },
  propsToSet: new Map().set('_state', 0),
  resetPropsTo: new Map().set('_state', DEFAULT_STATE),
});
describe('setState', () => {
  describe('with different lengths of value and isActiveThumbs', () => {
    test('the value and isActiveThumbs should have the same length', () => {
      const instance = new RangeSliderMainPresentationModel({
        options: {
          start: [-50, 0, 50],
        },
      }).setState({
        value: [-5, 0, 5],
        thumbs: [
          { isActive: false },
          { isActive: false },
          { isActive: false },
          { isActive: false },
        ],
      });
      const state = instance.getState();

      expect(state.value.length).toBe(state.thumbs.length);

      instance.setState({ value: [-15, 0, 15], thumbs: [{ isActive: false }] });

      expect(state.value.length).toBe(state.thumbs.length);
    });
  });
});
