import './range-slider__track.scss';

import { html, TemplateResult } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';
import { collapsingParseFloat } from '@utils/devTools/tools/ParserHelper';
import { fixLength } from '@utils/devTools/tools/ArrayHelper';

import IRangeSliderTrackView, {
  TrackOptions,
  FixedTrackOptions,
  TrackState,
} from './range-slider__track.view.coupling';

export const DEFAULT_OPTIONS: FixedTrackOptions = {
  orientation: 'horizontal',
  intervals: { min: -100, max: 100 },
  steps: ['none'],
  padding: [0, 0],
};

export const DEFAULT_STATE: TrackState = {};

export default class RangeSliderTrackView
  extends MVPView<FixedTrackOptions, TrackOptions, TrackState>
  implements IRangeSliderTrackView {
  static intervalsKeysCompareFunc(a: string, b: string) {
    if (a === 'min' || b === 'max') {
      return -1;
    }
    if (a === 'max' || b === 'min') {
      return 1;
    }
    return collapsingParseFloat(a) - collapsingParseFloat(b);
  }

  readonly template = (
    { classInfo = {}, styleInfo = {}, attributes = {} } = {},
    innerHTML: TemplateResult | TemplateResult[] = html``
  ) =>
    html`<div
      class=${classMap({
        'range-slider__track': true,
        [`range-slider__track_orientation-${this._options.orientation}`]: true,
        ...classInfo,
      })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    >
      ${innerHTML}
    </div>`;

  constructor(options: TrackOptions = DEFAULT_OPTIONS, state: TrackState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ['intervals', 'padding', 'steps'],
    });
  }

  getOrientationOption() {
    return this._options.orientation;
  }
  getIntervalsOption() {
    return { ...this._options.intervals };
  }
  getStepsOption() {
    return ([] as FixedTrackOptions['steps']).concat(this._options.steps);
  }
  getPaddingOption() {
    return ([] as number[]).concat(this._options.padding) as FixedTrackOptions['padding'];
  }

  setOrientationOption(orientation: TrackOptions['orientation'] = DEFAULT_OPTIONS.orientation) {
    this._options.orientation = orientation;

    return this;
  }
  setIntervalsOption(intervals: TrackOptions['intervals'] = DEFAULT_OPTIONS.intervals) {
    this._options.intervals = { ...intervals };

    this._fixIntervalsOption()._fixStepsOption()._fixPaddingOption();

    return this;
  }
  setStepsOption(steps: TrackOptions['steps'] = DEFAULT_OPTIONS.steps) {
    this._options.steps = Array.isArray(steps)
      ? ([] as FixedTrackOptions['steps']).concat(steps)
      : this._options.steps.fill(steps);

    this._fixStepsOption();

    return this;
  }
  setPaddingOption(padding: TrackOptions['padding'] = DEFAULT_OPTIONS.padding) {
    this._options.padding = Array.isArray(padding)
      ? (([] as number[]).concat(padding) as FixedTrackOptions['padding'])
      : this._options.padding.fill(padding);

    this._fixPaddingOption()._fixStepsOption();

    return this;
  }

  protected _fixIntervalsOption() {
    this._fixOrderOfIntervalsOption()._fixKeysOfIntervalsOption()._fixValuesOfIntervalsOption();

    return this;
  }
  protected _fixOrderOfIntervalsOption() {
    const intervalsKeys = this._getSortedKeysOfIntervalsOption();
    const intervalsValues = Object.values(this._options.intervals);
    intervalsValues.sort((a, b) => {
      return a - b;
    });

    const entries: [string, number][] = [];
    intervalsKeys.forEach((key, index) => {
      entries[index] = [key, intervalsValues[index]];
    });
    this._options.intervals = Object.fromEntries(entries) as FixedTrackOptions['intervals'];

    return this;
  }
  protected _fixKeysOfIntervalsOption() {
    Object.entries(this._options.intervals).forEach(([key, val]) => {
      let validKey: string | undefined;

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
      this._options.intervals.max++;
    }

    return this;
  }

  protected _fixStepsOption() {
    this._fixLengthOfStepsOption()._fixValuesOfStepsOption();

    return this;
  }
  protected _fixLengthOfStepsOption() {
    if (Array.isArray(this._options.steps)) {
      // const difference = Object.keys(this._options.intervals).length - this._options.steps.length;
      // const previousLength = this._options.steps.length;
      // if (difference !== 1) {
      //   this._options.steps.length += difference - 1;
      //   this._options.steps = this._options.steps.fill(DEFAULT_OPTIONS.steps[0], previousLength);
      // }
      fixLength(
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
    this._options.steps = this._options.steps.map((step, index, steps) => {
      if (step === 'none') return step;

      const maxStep =
        +Math.abs(
          this._options.intervals[intervalsKeys[index]] -
            this._options.intervals[intervalsKeys[index + 1]]
        ) -
        (index === 0 ? this._options.padding[0] : 0) -
        (index === steps.length - 1 ? this._options.padding[1] : 0);

      if (step > maxStep) {
        return maxStep;
      }

      if (step <= 0) {
        return DEFAULT_OPTIONS.steps[0];
      }

      return step;
    });
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

      if (padding < 0) return 0;
      if (padding > maxPad) return maxPad;

      return this._options.padding[index];
    }) as FixedTrackOptions['padding'];

    return this;
  }

  protected _getSortedKeysOfIntervalsOption() {
    const intervalsKeys = Object.keys(this._options.intervals);
    intervalsKeys.sort(RangeSliderTrackView.intervalsKeysCompareFunc);

    return intervalsKeys;
  }
}
