import "./range-slider__track.scss";

import { html, TemplateResult } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { spread } from "@open-wc/lit-helpers";

import { MVPView, template } from "@utils/devTools/tools/PluginCreationHelper";
import { collapsingParseFloat } from "@utils/devTools/tools/ParserHelper";

export default interface RangeSliderTrackView {
  getIntervalsOption(): FixedTrackOptions["intervals"];
  getStepsOption(): FixedTrackOptions["steps"];
  getPaddingOption(): FixedTrackOptions["padding"];
  setIntervalsOption(intervals?: TrackOptions["intervals"]): this;
  setStepsOption(steps?: TrackOptions["steps"]): this;
  setPaddingOption(padding?: TrackOptions["padding"]): this;
}

export type TrackOptions = {
  intervals?: { min: number; max: number; [key: string]: number };
  steps?: "none" | number | ("none" | number)[];
  padding?: number | [number, number];
};
export type FixedTrackOptions = {
  intervals: Required<TrackOptions>["intervals"];
  steps: ("none" | number)[];
  padding: [number, number];
};
export type TrackState = {};

export const DEFAULT_OPTIONS: FixedTrackOptions = {
  intervals: { min: -100, max: 100 },
  steps: ["none"],
  padding: [0, 0],
};
export const DEFAULT_STATE: TrackState = {};

const CALCULATION_PRECISION = 2;
export default class RangeSliderTrackView
  extends MVPView<FixedTrackOptions, TrackOptions, TrackState>
  implements RangeSliderTrackView {
  readonly template: template = (
    { classInfo = {}, styleInfo = {}, attributes = {} } = {},
    innerHTML: TemplateResult | TemplateResult[] = html``
  ) =>
    html`<div
      class=${classMap({
        "range-slider__track": true,
        ...classInfo,
      })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    >
      ${innerHTML}
    </div>`;

  constructor(options: TrackOptions = DEFAULT_OPTIONS, state: TrackState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ["intervals", "steps", "padding"],
    });
  }

  getIntervalsOption() {
    return { ...this._options.intervals };
  }
  getStepsOption() {
    return ([] as FixedTrackOptions["steps"]).concat(this._options.steps);
  }
  getPaddingOption() {
    return ([] as number[]).concat(this._options.padding) as FixedTrackOptions["padding"];
  }

  setIntervalsOption(intervals: TrackOptions["intervals"] = DEFAULT_OPTIONS.intervals) {
    this._options.intervals = { ...intervals };

    this._fixIntervalsOption()._fixStepsOption()._fixPaddingOption();

    return this;
  }
  setStepsOption(steps: TrackOptions["steps"] = DEFAULT_OPTIONS.steps) {
    this._options.steps = Array.isArray(steps)
      ? ([] as FixedTrackOptions["steps"]).concat(steps)
      : this._options.steps.fill(steps);

    this._fixStepsOption();

    return this;
  }
  setPaddingOption(padding: TrackOptions["padding"] = DEFAULT_OPTIONS.padding) {
    this._options.padding = Array.isArray(padding)
      ? (([] as number[]).concat(padding) as FixedTrackOptions["padding"])
      : this._options.padding.fill(padding);

    this._fixPaddingOption();

    return this;
  }

  protected _fixIntervalsOption() {
    const intervalsKeys = this._getSortedKeysOfIntervalsOption();
    const intervalsValues = Object.values(this._options.intervals);
    intervalsValues.sort((a, b) => {
      return a - b;
    });

    const entries: [string, number][] = [];
    intervalsKeys.forEach((key, index) => {
      entries[index] = [key, intervalsValues[index]];
    });
    this._options.intervals = Object.fromEntries(entries) as FixedTrackOptions["intervals"];

    Object.entries(this._options.intervals).forEach(([key, val]) => {
      let validKey: string | undefined;

      if (!(key === "min" || key === "max")) {
        let parsedKey = collapsingParseFloat(key);

        delete this._options.intervals[key];
        if (parsedKey > 0 && parsedKey < 100) {
          validKey = `${parsedKey}%`;
          this._options.intervals[`${parsedKey}%`] = val;
        }
      } else {
        validKey = key;
      }

      if (validKey) {
        if (val > Number.MAX_SAFE_INTEGER) {
          this._options.intervals[validKey] = Number.MAX_SAFE_INTEGER;
        }
        if (val < Number.MIN_SAFE_INTEGER) {
          this._options.intervals[validKey] = Number.MIN_SAFE_INTEGER;
        }

        this._options.intervals[validKey] = +this._options.intervals[validKey].toFixed(
          CALCULATION_PRECISION
        );
      }
    });

    if (this._options.intervals.min === this._options.intervals.max) {
      this._options.intervals.max++;
    }

    return this;
  }
  protected _fixStepsOption() {
    if (!Array.isArray(this._options.steps)) {
      const steps = new Array(Object.keys(this._options.intervals).length - 1);
      this._options.steps = steps.fill(this._options.steps);
    } else {
      while (this._options.steps.length < Object.keys(this._options.intervals).length - 1) {
        this._options.steps.push(DEFAULT_OPTIONS.steps[0]);
      }
      while (this._options.steps.length > Object.keys(this._options.intervals).length - 1) {
        this._options.steps.pop();
      }
    }

    const intervalsKeys = this._getSortedKeysOfIntervalsOption();
    this._options.steps = this._options.steps.map((step, index) => {
      const roundedStep = typeof step === "number" ? +step.toFixed(CALCULATION_PRECISION) : step;
      const maxStep = +Math.abs(
        this._options.intervals[intervalsKeys[index]] -
          this._options.intervals[intervalsKeys[index + 1]]
      ).toFixed(CALCULATION_PRECISION);

      if (roundedStep !== "none") {
        if (roundedStep > maxStep) {
          return maxStep;
        }

        if (roundedStep <= 0) {
          return DEFAULT_OPTIONS.steps[0];
        } else {
          return roundedStep;
        }
      } else {
        return step;
      }
    });

    return this;
  }
  protected _fixPaddingOption() {
    if (!Array.isArray(this._options.padding)) {
      this._options.padding = [this._options.padding, this._options.padding];
    }

    const intervalsKeys = this._getSortedKeysOfIntervalsOption();
    this._options.padding = this._options.padding.map((padding, index) => {
      const maxPad = +(
        (this._options.intervals[intervalsKeys[intervalsKeys.length - 1]] -
          this._options.intervals[intervalsKeys[0]]) /
        2
      ).toFixed(CALCULATION_PRECISION);

      if (padding < 0) return 0;
      if (padding > maxPad) return maxPad;

      return +this._options.padding[index].toFixed(CALCULATION_PRECISION);
    }) as FixedTrackOptions["padding"];

    return this;
  }

  protected _getSortedKeysOfIntervalsOption() {
    const intervalsKeys = Object.keys(this._options.intervals);
    intervalsKeys.sort(intervalsKeysCompareFunc);

    return intervalsKeys;
  }
}

export const intervalsKeysCompareFunc = (a, b) => {
  if (a === "min" || b === "max") {
    return -1;
  }
  if (a === "max" || b === "min") {
    return 1;
  }
  return collapsingParseFloat(a) - collapsingParseFloat(b);
};
