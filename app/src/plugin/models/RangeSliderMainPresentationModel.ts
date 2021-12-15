import {
  collapsingParseFloat,
  collapsingParseInt,
} from '@shared/utils/scripts/parser';
import { fixLength } from '@shared/utils/scripts/array';
import { ascending } from '@shared/utils/scripts/primitives';

import {
  RangeSliderPresentationModelOptions,
  RangeSliderPresentationModelNormalizedOptions,
  IRangeSliderFacadeModel,
} from './types';
import { DEFAULT_OPTIONS, DEFAULT_STATE } from './constants';
import RangeSliderAbstractPresentationModel from './RangeSliderAbstractPresentationModel';

class RangeSliderMainPresentationModel extends RangeSliderAbstractPresentationModel {
  protected static _intervalsKeysCompareFunc(a: string, b: string) {
    if (a === 'min' || b === 'max') {
      return -1;
    }

    if (a === 'max' || b === 'min') {
      return 1;
    }

    return collapsingParseFloat(a) - collapsingParseFloat(b);
  }

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

  protected _fixIntervalsOption() {
    this._fixKeysOfIntervalsOption()
      ._fixValuesOfIntervalsOption()
      ._fixOrderOfIntervalsOption();

    return this;
  }

  protected _fixOrderOfIntervalsOption() {
    const keys = this._getSortedKeysOfIntervalsOption();
    const values = Object.values(this._options.intervals);

    values.sort(ascending);

    const entries: [string, number][] = [];
    keys.forEach((key, index) => {
      entries[index] = [key, values[index]];
    });

    this._options.intervals = Object.fromEntries(
      entries
    ) as RangeSliderPresentationModelNormalizedOptions['intervals'];

    return this;
  }

  protected _fixKeysOfIntervalsOption() {
    Object.entries(this._options.intervals).forEach(([key, val]) => {
      let validKey: string;

      if (!(key === 'min' || key === 'max')) {
        const parsedKey = collapsingParseFloat(key);

        delete this._options.intervals[key];
        if (parsedKey > 0 && parsedKey < 100) {
          validKey = `${parsedKey}%`;
          this._options.intervals[validKey] = val;
        }
      } else {
        validKey = key;
      }
    });

    return this;
  }

  protected _fixValuesOfIntervalsOption() {
    Object.entries(this._options.intervals).forEach(([key, val]) => {
      if (val > Number.MAX_SAFE_INTEGER) {
        this._options.intervals[key] = Number.MAX_SAFE_INTEGER;
      }

      if (val < Number.MIN_SAFE_INTEGER) {
        this._options.intervals[key] = Number.MIN_SAFE_INTEGER;
      }
    });

    if (this._options.intervals.min === this._options.intervals.max) {
      this._options.intervals.max += 1;
    }

    return this;
  }

  protected _fixStartOption() {
    this._options.start = Array.isArray(this._options.start)
      ? this._options.start
      : [this._options.start];

    if (this._options.start.length < 1) {
      this._options.start = [...DEFAULT_OPTIONS.start];
    }

    const { min, max } = this._getValueBorder();
    this._options.start = this._options.start.map((start) => {
      if (start < min) {
        return min;
      }

      if (start > max) {
        return max;
      }

      return start;
    });

    this._options.start.sort(ascending);

    return this;
  }

  protected _fixStepsOption() {
    this._fixLengthOfStepsOption()._fixValuesOfStepsOption();

    return this;
  }

  protected _fixLengthOfStepsOption() {
    if (Array.isArray(this._options.steps)) {
      this._options.steps = fixLength(
        this._options.steps,
        Object.keys(this._options.intervals).length - 1,
        DEFAULT_OPTIONS.steps[0]
      );
    } else {
      const steps = new Array(Object.keys(this._options.intervals).length - 1);
      this._options.steps = steps.fill(this._options.steps);
    }

    return this;
  }

  protected _fixValuesOfStepsOption() {
    const intervalsKeys = this._getSortedKeysOfIntervalsOption();
    const [leftPad, rightPad] = this._options.padding;

    this._options.steps = this._options.steps.map((step, index, steps) => {
      if (step === 'none') {
        return step;
      }

      const maxStep =
        Math.abs(
          this._options.intervals[intervalsKeys[index]] -
            this._options.intervals[intervalsKeys[index + 1]]
        ) -
        (index === 0 ? leftPad : 0) -
        (index === steps.length - 1 ? rightPad : 0);

      if (step > maxStep) {
        return maxStep;
      }

      if (step <= 0) {
        return DEFAULT_OPTIONS.steps[0];
      }

      return step;
    });
  }

  protected _fixConnectOption() {
    const desiredLength = this._options.start.length + 1;

    this._options.connect = Array.isArray(this._options.connect)
      ? this._options.connect
      : new Array(desiredLength).fill(this._options.connect);

    this._options.connect = fixLength(
      this._options.connect,
      desiredLength,
      DEFAULT_OPTIONS.connect[0]
    );

    return this;
  }

  protected _fixPaddingOption() {
    if (!Array.isArray(this._options.padding)) {
      this._options.padding = [this._options.padding, this._options.padding];
    }

    const intervalsKeys = this._getSortedKeysOfIntervalsOption();
    this._options.padding = this._options.padding.map((padding, index) => {
      const maxPad =
        (this._options.intervals[intervalsKeys[intervalsKeys.length - 1]] -
          this._options.intervals[intervalsKeys[0]]) /
        2;

      if (padding < 0) {
        return 0;
      }

      if (padding > maxPad) {
        return maxPad;
      }

      return this._options.padding[index];
    }) as RangeSliderPresentationModelNormalizedOptions['padding'];

    return this;
  }

  protected _fixTooltipsOption() {
    const desiredLength = this._options.start.length;

    this._options.tooltips = Array.isArray(this._options.tooltips)
      ? this._options.tooltips
      : new Array(desiredLength).fill(this._options.tooltips);

    this._options.tooltips = fixLength(
      this._options.tooltips,
      desiredLength,
      DEFAULT_OPTIONS.tooltips[0]
    );

    return this;
  }

  protected _fixPipsOption() {
    if (!Array.isArray(this._options.pips.values)) {
      this._options.pips.values =
        this._options.pips.values < 1
          ? 0
          : Math.floor(this._options.pips.values);
    }

    this._fixPipsOptionDependOnMode();

    if (Array.isArray(this._options.pips.values)) {
      this._options.pips.values = [...new Set(this._options.pips.values)];
      this._options.pips.values.sort(ascending);
    }

    this._fixPipsDensityOption();

    return this;
  }

  protected _fixPipsOptionDependOnMode() {
    switch (this._options.pips.mode) {
      case 'intervals': {
        this._fixPipsOptionWithIntervalsMode();

        break;
      }
      case 'count': {
        this._fixPipsOptionWithCountMode();

        break;
      }
      case 'positions': {
        this._fixPipsOptionWithPositionsMode();

        break;
      }
      case 'values': {
        this._fixPipsOptionWithValuesMode();

        break;
      }

      // no default
    }
  }

  protected _fixPipsOptionWithIntervalsMode() {
    this._options.pips.values = Object.values(this._options.intervals);
  }

  protected _fixPipsOptionWithCountMode() {
    this._options.pips.values = Array.isArray(this._options.pips.values)
      ? this._options.pips.values.length
      : this._options.pips.values;
  }

  protected _fixPipsOptionWithPositionsMode() {
    if (Array.isArray(this._options.pips.values)) {
      this._options.pips.values = this._options.pips.values.filter(
        (value) => value >= 0 && value <= 100
      );
    } else {
      const amountOfValues = this._options.pips.values;

      const shiftInPercent = amountOfValues < 1 ? 0 : 100 / amountOfValues;

      let accumulator = -shiftInPercent;
      this._options.pips.values = new Array(amountOfValues + 1)
        .fill(-1)
        .map(() => {
          accumulator += shiftInPercent;

          return accumulator;
        });
    }
  }

  protected _fixPipsOptionWithValuesMode() {
    const { min, max } = this._getValueBorder();
    this._options.pips.values = Array.isArray(this._options.pips.values)
      ? this._options.pips.values.filter(
          (value) => value >= min && value <= max
        )
      : [];
  }

  protected _fixPipsDensityOption() {
    this._options.pips.density =
      this._options.pips.density < 0
        ? DEFAULT_OPTIONS.pips.density
        : this._options.pips.density;

    this._options.pips.density =
      this._options.pips.density > 3 ? 3 : this._options.pips.density;

    this._options.pips.density = collapsingParseInt(
      `${this._options.pips.density}`
    );

    return this;
  }

  protected _fixValueState() {
    this._state.value = fixLength(
      this._state.value,
      this._options.start.length,
      NaN
    );
    this._state.value = this._state.value.map((val, index) =>
      Number.isNaN(val) ? this._options.start[index] : val
    );

    const { min, max } = this._getValueBorder();
    this._state.value = this._state.value.map((value) => {
      if (value < min) {
        return min;
      }

      if (value > max) {
        return max;
      }

      return value;
    });

    this._state.value.sort(ascending);

    return this;
  }

  protected _fixThumbsState() {
    this._state.thumbs = fixLength(
      this._state.thumbs,
      this._state.value.length,
      { ...DEFAULT_STATE.thumbs[0] }
    );

    return this;
  }

  protected _getSortedKeysOfIntervalsOption() {
    const intervalsKeys = Object.keys(this._options.intervals);
    intervalsKeys.sort(
      RangeSliderMainPresentationModel._intervalsKeysCompareFunc
    );

    return intervalsKeys;
  }

  protected _getValueBorder() {
    const [leftPad, rightPad] = this._options.padding;

    return {
      min: this._options.intervals.min + leftPad,
      max: this._options.intervals.max - rightPad,
    };
  }
}

export { RangeSliderMainPresentationModel as default };
