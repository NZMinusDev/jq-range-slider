import "./range-slider.scss";

import RangeSliderTrack, {
  DEFAULT_OPTIONS as TRACK_DEFAULT_OPTIONS,
  FixedTrackOptions,
  intervalsKeysCompareFunc,
  TrackOptions,
} from "./../__track/view/range-slider__track.view";
import RangeSliderRangeView, {
  DEFAULT_OPTIONS as RANGE_DEFAULT_OPTIONS,
  RangeOptions,
} from "./../__range/view/range-slider__range.view";
import RangeSliderThumbView, {
  ThumbOptions,
  ThumbState,
} from "./../__thumb/view/range-slider__thumb.view";
import RangeSliderTooltipView, {
  TooltipOptions,
  TooltipState,
} from "./../__tooltip/view/range-slider__tooltip.view";
import RangeSliderPips, {
  DEFAULT_OPTIONS as PIPS_DEFAULT_OPTIONS,
  PipsOptions,
} from "./../__pips/view/range-slider__pips.view";

import defaultsDeep from "lodash-es/defaultsDeep";
import { html, TemplateResult } from "lit-html";
import { styleMap } from "lit-html/directives/style-map";
import { classMap } from "lit-html/directives/class-map";
import { spread } from "@open-wc/lit-helpers";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import { ascending } from "@utils/devTools/tools/ProcessingOfPrimitiveDataHelper";

export default interface RangeSliderView {
  getIntervalsOption(): FixedRangeSliderOptions["intervals"];
  getStartOption(): FixedRangeSliderOptions["start"];
  getStepsOption(): FixedRangeSliderOptions["steps"];
  getConnectOption(): FixedRangeSliderOptions["connect"];
  getOrientationOption(): FixedRangeSliderOptions["orientation"];
  getPaddingOption(): FixedRangeSliderOptions["padding"];
  getFormatterOption(): FixedRangeSliderOptions["formatter"];
  getTooltipsOption(): FixedRangeSliderOptions["tooltips"];
  getPipsOption(): FixedRangeSliderOptions["pips"];
  setIntervalsOption(intervals?: RangeSliderOptions["intervals"]): this;
  setStartOption(start?: RangeSliderOptions["start"]): this;
  setStepsOption(steps?: RangeSliderOptions["steps"]): this;
  setConnectOption(connect?: RangeSliderOptions["connect"]): this;
  setOrientationOption(orientation?: RangeSliderOptions["orientation"]): this;
  setPaddingOption(padding?: RangeSliderOptions["padding"]): this;
  setFormatterOption(formatter?: RangeSliderOptions["formatter"]): this;
  setTooltipsOption(tooltips?: RangeSliderOptions["tooltips"]): this;
  setPipsOption(pips?: RangeSliderOptions["pips"]): this;

  get(): FixedRangeSliderOptions["start"];
  set(value?: RangeSliderOptions["start"]): this;
}

export type RangeSliderOptions = {
  intervals?: TrackOptions["intervals"];
  start?: number | number[];
  steps?: TrackOptions["steps"];
  connect?: NonNullable<RangeOptions["isConnected"]> | Required<RangeOptions>["isConnected"][];
  orientation?: "horizontal" | "vertical";
  padding?: TrackOptions["padding"];
  formatter?: Formatter;
  tooltips?: boolean | (NonNullable<TooltipOptions["formatter"]> | boolean)[];
  pips?: Omit<PipsOptions, "formatter" | "values" | "orientation"> & {
    mode?: Mode;
    values?: number | number[];
  };
};
export type FixedRangeSliderOptions = {
  intervals: Required<RangeSliderOptions>["intervals"];
  start: number[];
  steps: FixedTrackOptions["steps"];
  connect: Required<RangeOptions>["isConnected"][];
  orientation: Required<RangeSliderOptions>["orientation"];
  padding: FixedTrackOptions["padding"];
  formatter: Required<RangeSliderOptions>["formatter"];
  tooltips: (Required<TooltipOptions>["formatter"] | boolean)[];
  pips: NonNullable<Required<RangeSliderOptions["pips"]>>;
};
export type RangeSliderState = {
  value: FixedRangeSliderOptions["start"];
};

export const DEFAULT_OPTIONS: FixedRangeSliderOptions = {
  intervals: TRACK_DEFAULT_OPTIONS.intervals,
  start: [0],
  steps: TRACK_DEFAULT_OPTIONS.steps,
  connect: [RANGE_DEFAULT_OPTIONS.isConnected, RANGE_DEFAULT_OPTIONS.isConnected],
  orientation: "horizontal",
  padding: TRACK_DEFAULT_OPTIONS.padding,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
  tooltips: [true],
  pips: {
    mode: "intervals",
    values: Object.values(TRACK_DEFAULT_OPTIONS.intervals),
    density: PIPS_DEFAULT_OPTIONS.density,
    isHidden: PIPS_DEFAULT_OPTIONS.isHidden,
  },
};
export const DEFAULT_STATE: RangeSliderState = {
  value: DEFAULT_OPTIONS.start,
};

export default class RangeSliderView
  extends MVPView<
    FixedRangeSliderOptions,
    RangeSliderOptions,
    RangeSliderState,
    "start" | "slide" | "update" | "change" | "set" | "end"
  >
  implements RangeSliderView {
  readonly template = ({ classInfo = {}, styleInfo = {}, attributes = {} } = {}) => html`<div
    class=${classMap({
      "range-slider": true,
      ...classInfo,
    })}
    ...=${spread(attributes)}
    style=${styleMap({ ...styleInfo })}
  >
    ${new RangeSliderTrack(this._toTrackOptions()).template(
      { attributes: { "@click": this._trackEventListenerObject } },
      ([] as TemplateResult[]).concat(
        this._options.connect
          .map((isConnected, index) => new RangeSliderRangeView(this._toRangeOptions(index)))
          .map((view, index) => {
            const a =
              index === 0 ? 0 : this._thumbValueToPositionOnTrack(index - 1).offsetOnTrackInPercent;
            const b = this._thumbValueToPositionOnTrack(index).offsetOnTrackInPercent;

            return view.template({
              styleInfo: {
                transform:
                  this._options.orientation === "horizontal"
                    ? `translate(${a}%, 0) scale(${(b - a) / 100}, 1)`
                    : `translate(0, ${a}%) scale(1, ${(b - a) / 100})`,
              },
            });
          }),
        this._state.value
          .map(
            (thumbValue, index) =>
              new RangeSliderThumbView(this._toThumbOptions(index), this._toThumbState(index))
          )
          .map((view, index, views) => {
            const baseZIndex = 2;
            const nextIndex = index + 1;
            const previousIndex = index - 1;
            const rangeOfSwapZIndex =
              (this._options.intervals.max - this._options.intervals.min) * 0.02;
            const trackBorder = this._getValueBorderOfTrack();
            const infimum =
              views[previousIndex] !== undefined
                ? this._state.value[previousIndex]
                : trackBorder.min;
            const supremum =
              views[nextIndex] !== undefined ? this._state.value[nextIndex] : trackBorder.max;

            const thumbOffsetOperands = this._thumbValueToPositionOnTrack(index);
            const thumbTranslate =
              thumbOffsetOperands.offsetOnTrackInPercent * thumbOffsetOperands.THUMB_SCALE_FACTOR -
              thumbOffsetOperands.THUMB_TO_CENTER_OFFSET;

            return view.template(
              {
                attributes: { "@pointerdown": this._thumbEventListenerObject },
                styleInfo: {
                  zIndex:
                    this._state.value[index] >= supremum - rangeOfSwapZIndex &&
                    this._state.value[index] >= infimum + rangeOfSwapZIndex
                      ? baseZIndex + 2 * views.length - index - 2 + ""
                      : baseZIndex + index + "",
                  transform:
                    this._options.orientation === "horizontal"
                      ? `translate(${thumbTranslate}%, 0)`
                      : `translate(0, ${thumbTranslate}%)`,
                },
              },
              new RangeSliderTooltipView(
                this._toTooltipOptions(index),
                this._toTooltipState(index)
              ).template()
            );
          })
      )
    )}
    ${new RangeSliderPips(this._toPipsOptions()).template({
      attributes: { "@click": this._pipsEventListenerObject },
    })}
  </div>`;

  constructor(
    options: RangeSliderOptions = DEFAULT_OPTIONS,
    state: RangeSliderState = {
      value: Array.isArray(options.start)
        ? options.start
        : [options.start ?? DEFAULT_STATE.value[0]],
    }
  ) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: [
        "intervals",
        "padding",
        "start",
        "steps",
        "connect",
        "orientation",
        "formatter",
        "tooltips",
        "pips",
      ],
    });
  }

  getIntervalsOption() {
    return { ...this._options.intervals };
  }
  getStartOption() {
    return ([] as number[]).concat(this._options.start);
  }
  getStepsOption() {
    return ([] as (number | "none")[]).concat(this._options.steps);
  }
  getConnectOption() {
    return ([] as boolean[]).concat(this._options.connect);
  }
  getOrientationOption() {
    return this._options.orientation;
  }
  getPaddingOption() {
    return ([] as number[]).concat(this._options.padding);
  }
  getFormatterOption() {
    return this._options.formatter;
  }
  getTooltipsOption() {
    return ([] as (boolean | Formatter)[]).concat(this._options.tooltips);
  }
  getPipsOption() {
    return defaultsDeep({}, this._options.pips);
  }

  setIntervalsOption(intervals: RangeSliderOptions["intervals"] = DEFAULT_OPTIONS.intervals) {
    this._options.intervals = { ...intervals };

    this._fixIntervalsOption()._fixStartOption()._fixPipsOption()._fixValueState();

    return this;
  }
  setStartOption(start: RangeSliderOptions["start"] = DEFAULT_OPTIONS.start) {
    this._options.start = Array.isArray(start)
      ? ([] as FixedRangeSliderOptions["start"]).concat(start)
      : this._options.start.fill(start);

    this._fixStartOption()._fixConnectOption()._fixTooltipsOption()._fixValueState();

    return this;
  }
  setStepsOption(steps: RangeSliderOptions["steps"] = DEFAULT_OPTIONS.steps) {
    this._options.steps = this._options.steps = Array.isArray(steps)
      ? (([] as (number | "none")[]).concat(steps) as FixedRangeSliderOptions["steps"])
      : this._options.steps.fill(steps);

    this._fixStepsOption();

    return this;
  }
  setConnectOption(connect: RangeSliderOptions["connect"] = DEFAULT_OPTIONS.connect) {
    this._options.connect = Array.isArray(connect)
      ? ([] as FixedRangeSliderOptions["connect"]).concat(connect)
      : this._options.connect.fill(connect);

    this._fixConnectOption();

    return this;
  }
  setOrientationOption(
    orientation: RangeSliderOptions["orientation"] = DEFAULT_OPTIONS.orientation
  ) {
    this._options.orientation = orientation;

    return this;
  }
  setPaddingOption(padding: RangeSliderOptions["padding"] = DEFAULT_OPTIONS.padding) {
    this._options.padding = Array.isArray(padding)
      ? (([] as number[]).concat(padding) as FixedRangeSliderOptions["padding"])
      : this._options.padding.fill(padding);

    this._fixPaddingOption()._fixStartOption()._fixValueState();

    return this;
  }
  setFormatterOption(formatter: RangeSliderOptions["formatter"] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    this._fixTooltipsOption();

    return this;
  }
  setTooltipsOption(tooltips: RangeSliderOptions["tooltips"] = DEFAULT_OPTIONS.tooltips) {
    this._options.tooltips = Array.isArray(tooltips)
      ? ([] as FixedRangeSliderOptions["tooltips"]).concat(tooltips)
      : this._options.tooltips.fill(tooltips);

    this._fixTooltipsOption();

    return this;
  }
  setPipsOption(pips: RangeSliderOptions["pips"] = DEFAULT_OPTIONS.pips) {
    if (
      Array.isArray(this._options.pips.values) &&
      Array.isArray(pips.values) &&
      this._options.pips.values.length > pips.values.length
    ) {
      this._options.pips.values.splice(pips.values.length === 0 ? 0 : pips.values.length - 1);
    }
    this._options.pips = defaultsDeep({}, pips, this._options.pips);

    this._fixPipsOption();

    return this;
  }

  get() {
    return ([] as FixedRangeSliderOptions["start"]).concat(this._state.value);
  }
  set(value: RangeSliderOptions["start"] = this._options.start) {
    this._setValueState(
      Array.isArray(value)
        ? ([] as RangeSliderState["value"]).concat(value)
        : this._state.value.fill(value)
    );

    this._render();

    this.trigger("update").trigger("set");

    return this;
  }

  protected _setValueState(value: RangeSliderState["value"] = DEFAULT_STATE["value"]) {
    this._state.value = ([] as RangeSliderState["value"]).concat(value);

    this._fixValueState();

    return this;
  }

  protected _fixIntervalsOption() {
    this._options.intervals = new RangeSliderTrack({
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      padding: this._options.padding,
      steps: this._options.steps,
    }).getOptions().intervals;

    return this;
  }
  protected _fixPaddingOption() {
    this._options.padding = new RangeSliderTrack({
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      padding: this._options.padding,
      steps: this._options.steps,
    }).getOptions().padding;

    return this;
  }
  protected _fixStartOption() {
    this._options.start = Array.isArray(this._options.start)
      ? this._options.start
      : [this._options.start];

    if (this._options.start.length < 1) {
      this._options.start = ([] as FixedRangeSliderOptions["start"]).concat(DEFAULT_OPTIONS.start);
    }

    const trackBorder = this._getValueBorderOfTrack();
    this._options.start = this._options.start.map((start) =>
      start < trackBorder.min ? trackBorder.min : start > trackBorder.max ? trackBorder.max : start
    );
    this._options.start.sort(ascending);

    return this;
  }
  protected _fixStepsOption() {
    this._options.steps = new RangeSliderTrack({
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      padding: this._options.padding,
      steps: this._options.steps,
    }).getOptions().steps;

    return this;
  }
  protected _fixPipsOption() {
    if (!Array.isArray(this._options.pips.values)) {
      this._options.pips.values =
        this._options.pips.values < 1 ? 0 : Math.floor(this._options.pips.values);
    }

    switch (this._options.pips.mode) {
      case "intervals": {
        this._options.pips.values = Object.values(this._options.intervals);
        break;
      }
      case "count": {
        this._options.pips.values = Array.isArray(this._options.pips.values)
          ? this._options.pips.values.length
          : this._options.pips.values;

        break;
      }
      case "positions": {
        if (Array.isArray(this._options.pips.values)) {
          this._options.pips.values = this._options.pips.values.filter(
            (value) => value >= 0 && value <= 100
          );
        } else {
          const amountOfValues = this._options.pips.values;
          this._options.pips.values = [];
          if (amountOfValues < 1) break;

          const shiftInPercent = 100 / amountOfValues;

          let accumulator = 0;
          for (let index = 0; index <= amountOfValues; index++) {
            this._options.pips.values.push(accumulator);
            accumulator += shiftInPercent;
          }
        }
        break;
      }
      case "values": {
        const valueBorderOfTrack = this._getValueBorderOfTrack();
        this._options.pips.values = Array.isArray(this._options.pips.values)
          ? this._options.pips.values.filter(
              (value) => value >= valueBorderOfTrack.min && value <= valueBorderOfTrack.max
            )
          : [];
        break;
      }
    }

    if (Array.isArray(this._options.pips.values)) {
      this._options.pips.values.sort(ascending);
    }
    this._options.pips.density = new RangeSliderPips(this._toPipsOptions()).getDensityOption();

    return this;
  }
  protected _fixConnectOption() {
    const desiredLength = this._options.start.length + 1;

    this._options.connect = Array.isArray(this._options.connect)
      ? this._options.connect
      : new Array(desiredLength).fill(this._options.connect);

    while (this._options.connect.length < desiredLength) {
      this._options.connect.push(DEFAULT_OPTIONS.connect[0]);
    }
    while (this._options.connect.length > desiredLength) {
      this._options.connect.pop();
    }

    return this;
  }
  protected _fixTooltipsOption() {
    const desiredLength = this._options.start.length;

    this._options.tooltips = Array.isArray(this._options.tooltips)
      ? this._options.tooltips
      : new Array(desiredLength).fill(this._options.tooltips);

    while (this._options.tooltips.length < desiredLength) {
      this._options.tooltips.push(DEFAULT_OPTIONS.tooltips[0]);
    }
    while (this._options.tooltips.length > desiredLength) {
      this._options.tooltips.pop();
    }

    return this;
  }

  protected _fixValueState() {
    const trackBorder = this._getValueBorderOfTrack();
    this._state.value = this._state.value.map((value) =>
      value < trackBorder.min ? trackBorder.min : value > trackBorder.max ? trackBorder.max : value
    );

    this._state.value.sort(ascending);

    return this;
  }

  protected _getValueBorderOfTrack() {
    return {
      min: this._options.intervals.min + this._options.padding[0],
      max: this._options.intervals.max - this._options.padding[1],
    };
  }
  protected _getLinearPercentBorderOfTrack() {
    const valueBorderOfTrack = this._getValueBorderOfTrack();

    return {
      min: this._toTrackPercent(valueBorderOfTrack.min),
      max: this._toTrackPercent(valueBorderOfTrack.max),
    };
  }
  protected _getIntervalInfoByPoint(value: number, { isIncludedInSupremum = false } = {}) {
    const intervalKeys = Object.keys(this._options.intervals).sort(intervalsKeysCompareFunc);

    if (value > this._options.intervals.max) return { keyOfInfimum: "max" };
    if (value < this._options.intervals.min) return { keyOfSupremum: "min" };

    let indexOfSupremum = isIncludedInSupremum
      ? intervalKeys.findIndex((key) => this._options.intervals[key] >= value)
      : intervalKeys.findIndex((key) => this._options.intervals[key] > value);
    if (value === this._options.intervals.max) indexOfSupremum = intervalKeys.length - 1;
    const keyOfInfimum = intervalKeys[indexOfSupremum - 1];
    const keyOfSupremum = intervalKeys[indexOfSupremum];

    const valueSize =
      this._options.intervals[keyOfSupremum] - this._options.intervals[keyOfInfimum];
    const percentSize =
      this._getIntervalKeyAsNumber(keyOfSupremum) - this._getIntervalKeyAsNumber(keyOfInfimum);

    const intervalRatio = valueSize / percentSize;
    const fullRatio = (this._options.intervals.max - this._options.intervals.min) / 100;

    const magnificationFactor = intervalRatio / fullRatio;

    const step = this._options.steps[indexOfSupremum - 1];

    return {
      keyOfInfimum,
      keyOfSupremum,
      valueSize,
      percentSize,
      magnificationFactor,
      step,
    };
  }
  protected _getIntervalKeyAsNumber(key: keyof Required<TrackOptions>["intervals"]) {
    return key === "min" ? 0 : key === "max" ? 100 : Number.parseFloat(`${key}`);
  }
  protected _toTrackPercent(valueOnTrack: number) {
    const intervalKeys = Object.keys(this._options.intervals).sort(intervalsKeysCompareFunc);

    let offsetOnTrackInPercent = 0;
    let intervalValueSize: number;
    let intervalPercentSize: number;
    let valuePerPercentInInterval: number;
    let isStopOffset = false;
    intervalKeys.forEach((intervalKey, index) => {
      if (!isStopOffset && intervalKeys[index + 1] !== undefined) {
        intervalValueSize =
          this._options.intervals[intervalKeys[index + 1]] - this._options.intervals[intervalKey];
        intervalPercentSize =
          this._getIntervalKeyAsNumber(intervalKeys[index + 1]) -
          this._getIntervalKeyAsNumber(intervalKeys[index]);
        valuePerPercentInInterval = intervalValueSize / intervalPercentSize;

        if (
          valueOnTrack >= this._options.intervals[intervalKey] &&
          valueOnTrack < this._options.intervals[intervalKeys[index + 1]]
        ) {
          offsetOnTrackInPercent +=
            (valueOnTrack - this._options.intervals[intervalKey]) / valuePerPercentInInterval;
          isStopOffset = true;
        } else {
          offsetOnTrackInPercent += intervalPercentSize;
        }
      } else {
        return;
      }
    });

    return offsetOnTrackInPercent;
  }
  protected _toTrackValue(linearPercentOnTrack: number) {
    const intervalKeys = Object.keys(this._options.intervals).sort(intervalsKeysCompareFunc);

    let trackValue = this._options.intervals.min;
    let intervalValueSize: number;
    let intervalPercentSize: number;
    let valuePerPercentInInterval: number;
    let isStopOffset = false;
    intervalKeys.forEach((intervalKey, index) => {
      if (!isStopOffset && intervalKeys[index + 1] !== undefined) {
        intervalValueSize =
          this._options.intervals[intervalKeys[index + 1]] - this._options.intervals[intervalKey];
        intervalPercentSize =
          this._getIntervalKeyAsNumber(intervalKeys[index + 1]) -
          this._getIntervalKeyAsNumber(intervalKeys[index]);
        valuePerPercentInInterval = intervalValueSize / intervalPercentSize;

        if (
          linearPercentOnTrack >= this._getIntervalKeyAsNumber(intervalKey) &&
          linearPercentOnTrack < this._getIntervalKeyAsNumber(intervalKeys[index + 1])
        ) {
          trackValue +=
            (linearPercentOnTrack - this._getIntervalKeyAsNumber(intervalKey)) *
            valuePerPercentInInterval;
          isStopOffset = true;
        } else {
          trackValue += intervalPercentSize * valuePerPercentInInterval;
        }
      } else {
        return;
      }
    });

    return trackValue;
  }

  protected _toTrackOptions(): FixedTrackOptions {
    return {
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      steps: this._options.steps,
      padding: this._options.padding,
    };
  }
  protected _toRangeOptions(index: number): Required<RangeOptions> {
    return { isConnected: this._options.connect[index] };
  }
  protected _toThumbOptions(index: number): Required<ThumbOptions> {
    return { start: this._options.start[index] };
  }
  protected _toTooltipOptions(index: number): Required<TooltipOptions> {
    const tooltip = this._options.tooltips[index];

    return {
      orientation: this._options.orientation === "horizontal" ? "top" : "left",
      formatter: typeof tooltip === "boolean" ? this._options.formatter : tooltip,
      isHidden: tooltip ? false : true,
    };
  }
  protected _toPipsOptions(): Required<PipsOptions> {
    const formatter = this._options.formatter;
    const { isHidden, density } = this._options.pips;
    let values = Array.isArray(this._options.pips.values)
      ? ([] as number[]).concat(this._options.pips.values)
      : [];

    const valueBorderOfTrack = this._getValueBorderOfTrack();

    let pipsValues: NonNullable<PipsOptions["values"]> = [];
    switch (this._options.pips.mode) {
      case "intervals": {
        const leftPadInPercent = this._toTrackPercent(
          this._options.intervals.min + this._options.padding[0]
        );
        const rightPadInPercent = this._toTrackPercent(
          this._options.intervals.max - this._options.padding[1]
        );

        values[0] = valueBorderOfTrack.min;
        values[values.length - 1] = valueBorderOfTrack.max;

        const lastIndex = values.length - 1;
        let percent: number;
        values.forEach((value, index) => {
          percent =
            index === 0
              ? leftPadInPercent
              : index === lastIndex
              ? rightPadInPercent
              : this._toTrackPercent(value);
          pipsValues.push({ percent, value });
        });

        break;
      }
      case "count": {
        const amountOfPipsValues = this._options.pips.values as number;
        if (amountOfPipsValues > 0) {
          const shift = (valueBorderOfTrack.max - valueBorderOfTrack.min) / amountOfPipsValues;

          let value = valueBorderOfTrack.min;
          for (let index = 0; index <= amountOfPipsValues; index++) {
            pipsValues.push({ percent: this._toTrackPercent(value), value });
            value += shift;
          }
        }

        break;
      }
      case "positions": {
        const perPercent = (valueBorderOfTrack.max - valueBorderOfTrack.min) / 100;
        pipsValues = values.map((value) => {
          value = value * perPercent - Math.abs(valueBorderOfTrack.min);
          return { percent: this._toTrackPercent(value), value };
        });

        break;
      }
      case "values": {
        pipsValues = values.map((value) => {
          return { percent: this._toTrackPercent(value), value };
        });
        break;
      }
    }

    return {
      orientation: this._options.orientation,
      isHidden,
      values: pipsValues,
      density,
      formatter,
    };
  }

  protected _toThumbState(index: number): ThumbState {
    const tooltipOptions = this._toTooltipOptions(index);

    const values = this._state.value;
    const value = values[index];
    const trackBorder = this._getValueBorderOfTrack();
    return {
      ariaOrientation: this._options.orientation,
      ariaValueMin: values[index - 1] ?? trackBorder.min,
      ariaValueMax: values[index + 1] ?? trackBorder.max,
      ariaValueNow: value,
      ariaValueText: tooltipOptions.formatter(value),
    };
  }
  protected _toTooltipState(index: number): TooltipState {
    return {
      value: this._state.value[index],
    };
  }

  protected _thumbEventListenerObject = {
    handleEvent: (event: Event) => {
      if ((event.target as HTMLElement).closest(".range-slider__thumb") === null) return;

      const thumbElem = (event.target as HTMLElement).closest(
        ".range-slider__thumb-origin"
      ) as HTMLElement;

      const thumbConstants = this._getThumbConstants(thumbElem);

      switch (event.type) {
        case "pointerdown": {
          const pointerEvent = event as PointerEvent;

          thumbElem.setPointerCapture(pointerEvent.pointerId);

          this._toggleTransitionAnimate(thumbElem, [...thumbConstants.siblingRanges]);

          this.trigger("start");

          let movementAcc = 0;
          const moveThumbTo = (pointerEvent: PointerEvent) => {
            if (
              this._options.orientation === "horizontal"
                ? pointerEvent.movementX === 0
                : pointerEvent.movementY === 0
            ) {
              return;
            }

            const newCalculated = thumbConstants.getCalculated();

            let thumbValue = this._state.value[thumbConstants.thumbIndex];
            let currentIntervalInfo = this._getIntervalInfoByPoint(thumbValue) as {
              keyOfInfimum: string;
              keyOfSupremum: string;
              valueSize: number;
              percentSize: number;
              magnificationFactor: number;
              step: number;
            };

            const trackBorder = this._getValueBorderOfTrack();
            const ariaValueMin =
              this._state.value[thumbConstants.thumbIndex - 1] ?? trackBorder.min;
            const ariaValueMax =
              this._state.value[thumbConstants.thumbIndex + 1] ?? trackBorder.max;

            movementAcc +=
              this._options.orientation === "horizontal"
                ? pointerEvent.movementX
                : pointerEvent.movementY;
            const thumbValueIncrementation =
              movementAcc * newCalculated.valuePerPx * currentIntervalInfo.magnificationFactor;
            thumbValue += thumbValueIncrementation;

            const shiftThroughIntervals = this._fixNonLinearShiftThroughIntervals(
              currentIntervalInfo,
              thumbValue,
              thumbValueIncrementation,
              movementAcc,
              newCalculated.valuePerPx
            );

            if (this._options.steps.find((step) => step !== "none") !== undefined) {
              const shiftOnLastInterval =
                shiftThroughIntervals.increments.length > 0
                  ? shiftThroughIntervals.increments[shiftThroughIntervals.increments.length - 1]
                  : thumbValueIncrementation;
              const steppedIncrementation = this._toThumbSteppedIncrementation(
                shiftOnLastInterval,
                shiftThroughIntervals.currentIntervalInfo.step
              );

              thumbValue =
                shiftThroughIntervals.thumbValueAfterIncrementation - shiftOnLastInterval;

              if (Math.abs(steppedIncrementation) > 0) {
                thumbValue += steppedIncrementation;
                movementAcc = 0;
              }
            } else {
              thumbValue = shiftThroughIntervals.thumbValueAfterIncrementation;
              movementAcc = 0;
            }

            thumbValue =
              thumbValue <= ariaValueMin
                ? ariaValueMin
                : thumbValue >= ariaValueMax
                ? ariaValueMax
                : thumbValue;

            this._state.value[thumbConstants.thumbIndex] = thumbValue;
            this._setState({});

            this.trigger("slide").trigger("update");
          };

          thumbElem.addEventListener("pointermove", moveThumbTo);
          thumbElem.addEventListener(
            "lostpointercapture",
            (event) => {
              thumbElem.removeEventListener("pointermove", moveThumbTo);
              this._toggleTransitionAnimate(thumbElem, [...thumbConstants.siblingRanges]);
              this.trigger("change").trigger("set").trigger("end");
            },
            { once: true }
          );

          break;
        }
      }
    },
  };
  protected _getThumbConstants(thumbElem: HTMLElement) {
    const trackElem = thumbElem.closest(".range-slider__track") as HTMLElement;
    const trackValueSize = this._options.intervals.max - this._options.intervals.min;
    const thumbIndex = Array.from(
      trackElem.querySelectorAll<HTMLElement>(".range-slider__thumb-origin")
    ).indexOf(thumbElem);
    const ranges = trackElem.querySelectorAll<HTMLElement>(".range-slider__range");
    const siblingRanges = [ranges.item(thumbIndex), ranges.item(thumbIndex + 1)] as [
      HTMLElement,
      HTMLElement
    ];

    return {
      trackElem,
      thumbIndex,
      trackValueSize,
      siblingRanges,
      getCalculated: () => {
        const valuePerPx =
          this._options.orientation === "horizontal"
            ? trackValueSize / trackElem.getBoundingClientRect().width
            : trackValueSize / trackElem.getBoundingClientRect().height;

        return {
          valuePerPx,
        };
      },
    };
  }
  protected _fixNonLinearShiftThroughIntervals(
    currentIntervalInfo: {
      keyOfInfimum: string;
      keyOfSupremum: string;
      magnificationFactor: number;
      step: number | "none";
    },
    thumbValueAfterIncrementation: number,
    thumbValueIncrementation: number,
    movement: number,
    valuePerPx: number
  ) {
    const increments: number[] = [];
    let isLessThanInfimum,
      isMoreThanSupremum,
      intermediateThumbValueIncrementation = thumbValueIncrementation;
    while (
      (isMoreThanSupremum =
        currentIntervalInfo.keyOfSupremum !== undefined &&
        thumbValueAfterIncrementation >
          this._options.intervals[currentIntervalInfo.keyOfSupremum]) ||
      (isLessThanInfimum =
        currentIntervalInfo.keyOfInfimum !== undefined &&
        thumbValueAfterIncrementation < this._options.intervals[currentIntervalInfo.keyOfInfimum])
    ) {
      const keyOfCrossedInterval = (isMoreThanSupremum
        ? currentIntervalInfo.keyOfSupremum
        : currentIntervalInfo.keyOfInfimum) as string;
      if (keyOfCrossedInterval === "max" || keyOfCrossedInterval === "min") break;

      const nextIntervalInfo = this._getIntervalInfoByPoint(
        this._options.intervals[keyOfCrossedInterval],
        { isIncludedInSupremum: isLessThanInfimum }
      );

      const thumbValueBeforeIncrementation =
        thumbValueAfterIncrementation - intermediateThumbValueIncrementation;

      const complementToWholeIntervalValue =
        this._options.intervals[keyOfCrossedInterval] - thumbValueBeforeIncrementation;

      const toWholeIntervalFactor =
        complementToWholeIntervalValue / intermediateThumbValueIncrementation;
      const toNewValueFactor = 1 - toWholeIntervalFactor;

      intermediateThumbValueIncrementation =
        movement *
        valuePerPx *
        (toWholeIntervalFactor * currentIntervalInfo.magnificationFactor +
          toNewValueFactor * (nextIntervalInfo.magnificationFactor as number));

      thumbValueAfterIncrementation =
        thumbValueBeforeIncrementation + intermediateThumbValueIncrementation;

      intermediateThumbValueIncrementation =
        thumbValueAfterIncrementation - this._options.intervals[keyOfCrossedInterval];
      movement -= movement * toWholeIntervalFactor;

      increments.push(intermediateThumbValueIncrementation);

      currentIntervalInfo = this._getIntervalInfoByPoint(
        this._options.intervals[keyOfCrossedInterval],
        { isIncludedInSupremum: isLessThanInfimum }
      ) as any;
    }

    return {
      thumbValueAfterIncrementation,
      increments,
      currentIntervalInfo,
    };
  }
  protected _toThumbSteppedIncrementation(
    thumbIncrementationOfLastInterval: number,
    step: number | "none"
  ) {
    if (step === "none") return thumbIncrementationOfLastInterval;

    const signFactor = thumbIncrementationOfLastInterval >= 0 ? 1 : -1;

    return signFactor * Math.floor(Math.abs(thumbIncrementationOfLastInterval) / step) * step;
  }
  protected _thumbValueToPositionOnTrack(thumbIndex: number) {
    const TRACK_RELATIVE_SIZE_IN_PERCENT = 100;
    const ORIGIN_THUMB_RELATIVE_SIZE_IN_PERCENT = 5;
    const THUMB_SCALE_FACTOR =
      TRACK_RELATIVE_SIZE_IN_PERCENT / ORIGIN_THUMB_RELATIVE_SIZE_IN_PERCENT;

    const THUMB_TO_CENTER_OFFSET = 50;

    const offsetOnTrackInPercent = this._toTrackPercent(this._state.value[thumbIndex]);

    return { offsetOnTrackInPercent, THUMB_SCALE_FACTOR, THUMB_TO_CENTER_OFFSET };
  }
  protected _toggleTransitionAnimate(
    thumbElem: HTMLElement,
    siblingRangeElements: [HTMLElement, HTMLElement]
  ) {
    const thumbTransition = thumbElem.style.transition;
    const siblingRangesTransitions = [
      siblingRangeElements[0].style.transition,
      siblingRangeElements[1].style.transition,
    ];

    if (
      thumbTransition !== "" ||
      siblingRangesTransitions[0] !== "" ||
      siblingRangesTransitions[1] !== ""
    ) {
      thumbElem.style.transition = "";
      siblingRangeElements[0].style.transition = "";
      siblingRangeElements[1].style.transition = "";
    } else {
      thumbElem.style.transition = "initial";
      siblingRangeElements[0].style.transition = "initial";
      siblingRangeElements[1].style.transition = "initial";
    }
  }

  protected _trackEventListenerObject = {
    handleEvent: (event: Event) => {
      const trackElem = (event.target as HTMLElement).closest(
        ".range-slider__track"
      ) as HTMLElement;

      if ((event.target as HTMLElement).closest(".range-slider__thumb-origin") !== null) return;

      switch (event.type) {
        case "click": {
          const clickEvent = event as MouseEvent;
          const trackBoundingClientRect = trackElem.getBoundingClientRect();
          const linearPercentTrackBorder = this._getLinearPercentBorderOfTrack();
          const clickedLinearPercent =
            this._options.orientation === "horizontal"
              ? ((clickEvent.clientX - trackBoundingClientRect.left) /
                  trackBoundingClientRect.width) *
                100
              : ((clickEvent.clientY - trackBoundingClientRect.top) /
                  trackBoundingClientRect.height) *
                100;

          const validatedClickedLinearPercent =
            clickedLinearPercent < linearPercentTrackBorder.min
              ? linearPercentTrackBorder.min
              : clickedLinearPercent > linearPercentTrackBorder.max
              ? linearPercentTrackBorder.max
              : clickedLinearPercent;
          const clickedValue = this._toTrackValue(validatedClickedLinearPercent) as number;

          this._state.value[this._getNearestThumb(clickedValue)] = clickedValue;
          this._setState({});

          this.trigger("slide").trigger("update").trigger("change").trigger("set");
        }
      }
    },
  };
  protected _getNearestThumb(value: number) {
    const distances = this._state.value.map((thumbValue) => Math.abs(thumbValue - value));

    return distances.indexOf(Math.min(...distances));
  }

  protected _pipsEventListenerObject = {
    handleEvent: (event: Event) => {
      const pipValueElem = (event.target as HTMLElement).closest(
        ".range-slider__pips-value"
      ) as HTMLElement;

      if (pipValueElem === null) return;

      switch (event.type) {
        case "click": {
          const pipValue = pipValueElem.dataset.value as string;

          this._state.value[this._getNearestThumb(+pipValue)] = +pipValue;
          this._setState({});

          this.trigger("slide").trigger("update").trigger("change").trigger("set");
        }
      }
    },
  };
}

interface eventHandler {
  (values: number[], isTapped: boolean): void;
}
type Formatter = (value: number) => string;
type Mode = "intervals" | "count" | "positions" | "values";
