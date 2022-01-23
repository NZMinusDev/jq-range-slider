/* eslint-disable class-methods-use-this */
import {
  collapsingParseFloat,
  collapsingParseInt,
} from '@shared/utils/scripts/parser';
import { fixLength } from '@shared/utils/scripts/array';
import { ascending } from '@shared/utils/scripts/primitives';
import { RequiredDeep } from '@shared/utils/scripts/types/utility';
import { RangeSliderPluginNormalizedOptions } from '@plugin/types';

import {
  RangeSliderPresentationModelOptions,
  RangeSliderPresentationModelNormalizedOptions,
  RangeSliderPresentationModelState,
  IRangeSliderFacadeModel,
} from './types';
import { DEFAULT_OPTIONS, DEFAULT_STATE } from './constants';
import RangeSliderAbstractPresentationModel from './RangeSliderAbstractPresentationModel';

class RangeSliderMainPresentationModel extends RangeSliderAbstractPresentationModel {
  constructor({
    options,
    facadeModel,
  }: {
    options?: RangeSliderPresentationModelOptions;
    facadeModel?: IRangeSliderFacadeModel;
  } = {}) {
    const start = options?.start;

    let value: number[] | undefined;

    if (start !== undefined) {
      value = Array.isArray(start) ? [...start] : [start];
    }

    const state = {
      value,
    };

    super(DEFAULT_OPTIONS, DEFAULT_STATE, {
      options,
      state,
      theOrderOfIteratingThroughTheOptions: [
        'intervals',
        'padding',
        'start',
        'steps',
        'connect',
        'orientation',
        'formatter',
        'tooltips',
        'pips',
      ],
      theOrderOfIteratingThroughTheState: ['value', 'thumbs'],
      facadeModel,
    });
  }

  protected _fixIntervalsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    return this._fixOrderOfIntervalsOption(
      this._fixValuesOfIntervalsOption(this._fixKeysOfIntervalsOption(options))
    );
  }

  protected _fixOrderOfIntervalsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { intervals } = options;
    const keys =
      RangeSliderMainPresentationModel._getSortedKeysOfIntervalsOption(options);
    let values = Object.values(intervals);

    values = values.sort(ascending);

    const entries: [string, number][] = keys.map((key, index) => [
      key,
      values[index],
    ]);
    const newIntervals = Object.fromEntries(
      entries
    ) as RangeSliderPresentationModelNormalizedOptions['intervals'];

    return { ...options, intervals: newIntervals };
  }

  protected _fixKeysOfIntervalsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { intervals } = options;
    const newIntervals = Object.entries(intervals).reduce((acc, current) => {
      const [key, value] = current;
      const newAcc = { ...acc };

      if (!(key === 'min' || key === 'max')) {
        const parsedKey = collapsingParseFloat(key);

        if (parsedKey > 0 && parsedKey < 100) {
          const validKey = `${parsedKey}%`;
          newAcc[validKey] = value;
        }
      } else {
        newAcc[key] = value;
      }

      return newAcc;
    }, {} as RangeSliderPresentationModelNormalizedOptions['intervals']);

    return { ...options, intervals: newIntervals };
  }

  protected _fixValuesOfIntervalsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { intervals } = options;
    const newIntervals = Object.entries(intervals).reduce((acc, current) => {
      const [key, value] = current;
      const newAcc = { ...acc };

      if (value > Number.MAX_SAFE_INTEGER) {
        newAcc[key] = Number.MAX_SAFE_INTEGER;
      } else if (value < Number.MIN_SAFE_INTEGER) {
        newAcc[key] = Number.MIN_SAFE_INTEGER;
      } else {
        newAcc[key] = value;
      }

      return newAcc;
    }, {} as RangeSliderPresentationModelNormalizedOptions['intervals']);

    if (newIntervals.min === newIntervals.max) {
      newIntervals.max += 1;
    }

    return { ...options, intervals: newIntervals };
  }

  protected _fixStartOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
    }
  ) {
    const { start } = options;
    let newStart = Array.isArray(start) ? start : [start];

    if (newStart.length < 1) {
      newStart = [...DEFAULT_OPTIONS.start];
    }

    const { min, max } =
      RangeSliderMainPresentationModel._getValueBorder(options);
    newStart = newStart.map((value) => {
      if (value < min) {
        return min;
      }

      if (value > max) {
        return max;
      }

      return value;
    });

    newStart = newStart.sort(ascending);

    return { ...options, start: newStart };
  }

  protected _fixStepsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
    }
  ) {
    return this._fixValuesOfStepsOption(this._fixLengthOfStepsOption(options));
  }

  protected _fixLengthOfStepsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
    }
  ) {
    const { steps, intervals } = options;
    let newSteps: RangeSliderPresentationModelNormalizedOptions['steps'] = [];

    if (Array.isArray(steps)) {
      newSteps = fixLength(
        steps,
        Object.keys(intervals).length - 1,
        DEFAULT_OPTIONS.steps[0]
      );
    } else {
      newSteps = new Array(Object.keys(intervals).length - 1).fill(steps);
    }

    return { ...options, steps: newSteps };
  }

  protected _fixValuesOfStepsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
      steps: RangeSliderPluginNormalizedOptions['steps'];
    }
  ) {
    const { steps, intervals, padding } = options;
    const intervalsKeys =
      RangeSliderMainPresentationModel._getSortedKeysOfIntervalsOption(options);
    const [leftPad, rightPad] = padding;
    let newSteps = [...steps];

    newSteps = newSteps.map((step, index, arr) => {
      if (step === 'none') {
        return step;
      }

      const maxStep =
        Math.abs(
          intervals[intervalsKeys[index]] - intervals[intervalsKeys[index + 1]]
        ) -
        (index === 0 ? leftPad : 0) -
        (index === arr.length - 1 ? rightPad : 0);

      if (step > maxStep) {
        return maxStep;
      }

      if (step <= 0) {
        return DEFAULT_OPTIONS.steps[0];
      }

      return step;
    });

    return { ...options, steps: newSteps };
  }

  protected _fixConnectOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      start: RangeSliderPluginNormalizedOptions['start'];
    }
  ) {
    const { connect, start } = options;
    const desiredLength = start.length + 1;
    let newConnect = Array.isArray(connect)
      ? connect
      : new Array(desiredLength).fill(connect);

    newConnect = fixLength(
      newConnect,
      desiredLength,
      DEFAULT_OPTIONS.connect[0]
    );

    return { ...options, connect: newConnect };
  }

  protected _fixPaddingOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { padding, intervals } = options;
    let newPadding: [number, number] = Array.isArray(padding)
      ? [...padding]
      : [padding, padding];

    if (!Array.isArray(padding)) {
      newPadding = [padding, padding];
    }

    const intervalsKeys =
      RangeSliderMainPresentationModel._getSortedKeysOfIntervalsOption(options);

    newPadding = newPadding.map((pad) => {
      const maxPad =
        (intervals[intervalsKeys[intervalsKeys.length - 1]] -
          intervals[intervalsKeys[0]]) /
        2;

      if (pad < 0) {
        return 0;
      }

      if (pad > maxPad) {
        return maxPad;
      }

      return pad;
    }) as [number, number];

    return { ...options, padding: newPadding };
  }

  protected _fixTooltipsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      start: RangeSliderPluginNormalizedOptions['start'];
    }
  ) {
    const { tooltips, start } = options;
    const desiredLength = start.length;
    let newTooltips = Array.isArray(tooltips)
      ? [...tooltips]
      : new Array(desiredLength).fill(tooltips);

    newTooltips = fixLength(
      newTooltips,
      desiredLength,
      DEFAULT_OPTIONS.tooltips[0]
    );

    return { ...options, tooltips: newTooltips };
  }

  protected _fixPipsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
    }
  ) {
    const { pips } = options;
    const { values } = pips;
    let newPipsValues: RangeSliderPresentationModelNormalizedOptions['pips']['values'] =
      [];

    if (!Array.isArray(values)) {
      newPipsValues = values < 1 ? 0 : Math.floor(values);
    } else {
      newPipsValues = [...values];
    }

    const newPips = { ...pips, values: newPipsValues };

    return this._fixPipsDensityOption(
      this._fixPipsValuesOption(
        this._fixPipsOptionDependOnMode({ ...options, pips: newPips })
      )
    );
  }

  // eslint-disable-next-line consistent-return
  protected _fixPipsOptionDependOnMode(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
    }
  ) {
    const { pips } = options;

    switch (pips.mode) {
      case 'intervals': {
        return this._fixPipsOptionWithIntervalsMode(options);
      }
      case 'count': {
        return this._fixPipsOptionWithCountMode(options);
      }
      case 'positions': {
        return this._fixPipsOptionWithPositionsMode(options);
      }
      case 'values': {
        return this._fixPipsOptionWithValuesMode(options);
      }

      // no default
    }
  }

  protected _fixPipsOptionWithIntervalsMode(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { pips, intervals } = options;
    const newValues = Object.values(intervals);

    return { ...options, pips: { ...pips, values: newValues } };
  }

  protected _fixPipsOptionWithCountMode(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { pips } = options;
    const { values } = pips;
    const newValues = Array.isArray(values) ? values.length : values;

    return { ...options, pips: { ...pips, values: newValues } };
  }

  protected _fixPipsOptionWithPositionsMode(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { pips } = options;
    const { values } = pips;
    let newValues: typeof pips['values'];

    if (Array.isArray(values)) {
      newValues = values.filter((value) => value >= 0 && value <= 100);
    } else {
      const amountOfValues = values;

      const shiftInPercent = amountOfValues < 1 ? 0 : 100 / amountOfValues;

      let accumulator = -shiftInPercent;
      newValues = new Array(amountOfValues + 1).fill(-1).map(() => {
        accumulator += shiftInPercent;

        return accumulator;
      });
    }

    return { ...options, pips: { ...pips, values: newValues } };
  }

  protected _fixPipsOptionWithValuesMode(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
    }
  ) {
    const { pips } = options;
    const { values } = pips;
    const { min, max } =
      RangeSliderMainPresentationModel._getValueBorder(options);
    const newValues = Array.isArray(values)
      ? values.filter((value) => value >= min && value <= max)
      : [];

    return { ...options, pips: { ...pips, values: newValues } };
  }

  protected _fixPipsValuesOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { pips } = options;
    const { values } = pips;
    let newValues: typeof pips['values'];

    if (Array.isArray(values)) {
      newValues = [...new Set(values)];
      newValues = newValues.sort(ascending);
    } else {
      newValues = values;
    }

    return { ...options, pips: { ...pips, values: newValues } };
  }

  protected _fixPipsDensityOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { pips } = options;
    const { density } = pips;
    let newDensity = density < 0 ? DEFAULT_OPTIONS.pips.density : density;

    newDensity = newDensity > 3 ? 3 : newDensity;

    newDensity = collapsingParseInt(`${newDensity}`);

    return { ...options, pips: { ...pips, density: newDensity } };
  }

  protected _fixValueState(
    options: RangeSliderPresentationModelNormalizedOptions,
    state: RequiredDeep<RangeSliderPresentationModelState>
  ) {
    const { start } = options;
    const { value } = state;
    let newValue = fixLength(value, start.length, NaN);
    newValue = newValue.map((val, index) =>
      Number.isNaN(val) ? start[index] : val
    );

    const { min, max } =
      RangeSliderMainPresentationModel._getValueBorder(options);
    newValue = newValue.map((val) => {
      if (val < min) {
        return min;
      }

      if (val > max) {
        return max;
      }

      return val;
    });

    newValue = newValue.sort(ascending);

    return { ...state, value: newValue };
  }

  protected _fixThumbsState(
    options: RangeSliderPresentationModelNormalizedOptions,
    state: RequiredDeep<RangeSliderPresentationModelState>
  ) {
    const { thumbs, value } = state;
    const newThumbs = fixLength(thumbs, value.length, {
      ...DEFAULT_STATE.thumbs[0],
    });

    return { ...state, thumbs: newThumbs };
  }

  protected static _intervalsKeysCompareFunc(a: string, b: string) {
    if (a === 'min' || b === 'max') {
      return -1;
    }

    if (a === 'max' || b === 'min') {
      return 1;
    }

    return collapsingParseFloat(a) - collapsingParseFloat(b);
  }

  protected static _getSortedKeysOfIntervalsOption(
    options: RequiredDeep<RangeSliderPresentationModelOptions>
  ) {
    const { intervals } = options;

    return Object.keys(intervals).sort(
      RangeSliderMainPresentationModel._intervalsKeysCompareFunc
    );
  }

  protected static _getValueBorder(
    options: RequiredDeep<RangeSliderPresentationModelOptions> & {
      padding: RangeSliderPluginNormalizedOptions['padding'];
    }
  ) {
    const { intervals, padding } = options;
    const [leftPad, rightPad] = padding;

    return {
      min: intervals.min + leftPad,
      max: intervals.max - rightPad,
    };
  }
}

export { RangeSliderMainPresentationModel as default };
