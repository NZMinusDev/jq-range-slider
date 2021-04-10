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
  DEFAULT_OPTIONS as THUMB_DEFAULT_OPTIONS,
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

import { defaultsDeep } from "lodash-es";
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
  getAnimateOption(): FixedRangeSliderOptions["animate"];
  setIntervalsOption(intervals?: RangeSliderOptions["intervals"]): this;
  setStartOption(start?: RangeSliderOptions["start"]): this;
  setStepsOption(steps?: RangeSliderOptions["steps"]): this;
  setConnectOption(connect?: RangeSliderOptions["connect"]): this;
  setOrientationOption(orientation?: RangeSliderOptions["orientation"]): this;
  setPaddingOption(padding?: RangeSliderOptions["padding"]): this;
  setFormatterOption(formatter?: RangeSliderOptions["formatter"]): this;
  setTooltipsOption(tooltips?: RangeSliderOptions["tooltips"]): this;
  setPipsOption(pips?: RangeSliderOptions["pips"]): this;
  setAnimateOption(animate?: RangeSliderOptions["animate"]): this;

  get(): FixedRangeSliderOptions["start"];
  set(value?: RangeSliderOptions["start"]): this;

  whenIsStarted(callback: eventHandler): this;
  whenIsSlid(callback: eventHandler): this;
  whenIsUpdated(callback: eventHandler): this;
  whenIsChanged(callback: eventHandler): this;
  whenIsSet(callback: eventHandler): this;
  whenIsEnded(callback: eventHandler): this;
}

export type RangeSliderOptions = {
  intervals?: TrackOptions["intervals"];
  start?: ThumbOptions["start"] | NonNullable<ThumbOptions["start"]>[];
  steps?: TrackOptions["steps"];
  connect?: NonNullable<RangeOptions["isConnected"]> | Required<RangeOptions>["isConnected"][];
  orientation?: "horizontal" | "vertical";
  padding?: TrackOptions["padding"];
  formatter?: Formatter;
  tooltips?: boolean | (NonNullable<TooltipOptions["formatter"]> | boolean)[];
  pips?: Omit<PipsOptions, "formatter" | "values"> & { mode?: Mode; values?: number | number[] };
  animate?: (timeFraction: number) => number;
};
export type FixedRangeSliderOptions = {
  intervals: Required<RangeSliderOptions>["intervals"];
  start: Required<ThumbOptions>["start"][];
  steps: FixedTrackOptions["steps"];
  connect: Required<RangeOptions>["isConnected"][];
  orientation: Required<RangeSliderOptions>["orientation"];
  padding: FixedTrackOptions["padding"];
  formatter: Required<RangeSliderOptions>["formatter"];
  tooltips: (Required<TooltipOptions>["formatter"] | boolean)[];
  pips: NonNullable<Required<RangeSliderOptions["pips"]>>;
  animate: Required<RangeSliderOptions>["animate"];
};
export type RangeSliderState = {
  value: FixedRangeSliderOptions["start"];
};

export const DEFAULT_OPTIONS: FixedRangeSliderOptions = {
  intervals: TRACK_DEFAULT_OPTIONS.intervals,
  start: [THUMB_DEFAULT_OPTIONS.start],
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
  animate: (timeFraction: number) => timeFraction ** 2,
};
export const DEFAULT_STATE: RangeSliderState = {
  value: DEFAULT_OPTIONS.start,
};

export default class RangeSliderView
  extends MVPView<FixedRangeSliderOptions, RangeSliderOptions, RangeSliderState, "">
  implements RangeSliderView {
  readonly template = ({ classInfo = {}, styleInfo = {}, attributes = {} } = {}) => html`<div
    class=${classMap({
      "range-slider": true,
      ["range-slider_orientation-" + this._options.orientation]: true,
      ...classInfo,
    })}
    ...=${spread(attributes)}
    style=${styleMap({ ...styleInfo })}
  >
    ${new RangeSliderTrack(this._toTrackOptions()).template(
      {},
      ([] as TemplateResult[]).concat(
        this._options.connect
          .map((isConnected, index) => new RangeSliderRangeView(this._toRangeOptions(index)))
          .map((view) => view.template()),
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
            const infimum =
              views[previousIndex] !== undefined
                ? this._state.value[previousIndex]
                : this._options.intervals.min;
            const supremum =
              views[nextIndex] !== undefined
                ? this._state.value[nextIndex]
                : this._options.intervals.max;

            return view.template(
              {
                attributes: { "@pointerdown": this._thumbEventListenerObject },
                styleInfo: {
                  zIndex:
                    this._state.value[index] >= supremum - rangeOfSwapZIndex &&
                    this._state.value[index] >= infimum + rangeOfSwapZIndex
                      ? baseZIndex + 2 * views.length - index - 2 + ""
                      : baseZIndex + index + "",
                  transform: `translate(${this._thumbValueToPositionOnTrack(index)}%, 0)`,
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
    ${new RangeSliderPips(this._toPipsOptions()).template()}
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
        "start",
        "steps",
        "connect",
        "orientation",
        "padding",
        "formatter",
        "tooltips",
        "pips",
        "animate",
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
  getAnimateOption() {
    return this._options.animate;
  }

  setIntervalsOption(intervals: RangeSliderOptions["intervals"] = DEFAULT_OPTIONS.intervals) {
    this._options.intervals = { ...intervals };

    this._fixStartOption()._fixPipsOption()._fixValueState();

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
    this._options.pips = defaultsDeep({}, pips, this._options.pips);

    this._fixPipsOption();

    return this;
  }
  setAnimateOption(animate: RangeSliderOptions["animate"] = DEFAULT_OPTIONS.animate) {
    this._options.animate = animate;

    return this;
  }

  get() {
    return ([] as FixedRangeSliderOptions["start"]).concat(this._state.value);
  }
  set(value: RangeSliderOptions["start"] = this._options.start) {
    this._state.value = Array.isArray(value)
      ? ([] as RangeSliderState["value"]).concat(value)
      : this._state.value.fill(value);

    return this;
  }

  protected _setState(state?: RangeSliderState) {
    super._setState(state);

    this.set(state?.value);

    return this;
  }

  protected _fixStartOption() {
    this._options.start = Array.isArray(this._options.start)
      ? this._options.start
      : [this._options.start];

    if (this._options.start.length < 1) {
      this._options.start = ([] as FixedRangeSliderOptions["start"]).concat(DEFAULT_OPTIONS.start);
    }

    this._options.start = this._options.start.map((start) =>
      start < this._options.intervals.min
        ? this._options.intervals.min
        : start > this._options.intervals.max
        ? this._options.intervals.max
        : start
    );
    this._options.start.sort(ascending);

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
  protected _fixPipsOption() {
    switch (this._options.pips.mode) {
      case "intervals": {
        this._options.pips.values = Object.values(this._options.intervals);
        break;
      }
      case "count": {
        this._options.pips.values = Array.isArray(this._options.pips.values)
          ? this._options.pips.values.length
          : this._options.pips.values < 0
          ? 0
          : this._options.pips.values;
        break;
      }
      case "positions": {
        this._options.pips.values = Array.isArray(this._options.pips.values)
          ? this._options.pips.values.filter((value) => value >= 0 && value <= 100)
          : [0, 25, 50, 75, 100];
        break;
      }
      case "values": {
        this._options.pips.values = Array.isArray(this._options.pips.values)
          ? this._options.pips.values.filter(
              (value) =>
                value >= this._options.intervals.min && value <= this._options.intervals.max
            )
          : ([] as number[]).concat(DEFAULT_OPTIONS.pips.values);
        break;
      }
    }

    return this;
  }

  protected _fixValueState() {
    this._state.value = this._state.value.map((value) =>
      value < this._options.intervals.min
        ? this._options.intervals.min
        : value > this._options.intervals.max
        ? this._options.intervals.max
        : value
    );

    this._state.value.sort(ascending);

    return this;
  }

  protected _getIntervalInfoByPoint(value: number) {
    const intervalKeys = Object.keys(this._options.intervals).sort(intervalsKeysCompareFunc);

    if (value > this._options.intervals.max) return { keyOfInfimum: "max" };
    if (value < this._options.intervals.min) return { keyOfSupremum: "min" };

    const indexOfSupremum = intervalKeys.findIndex((key) => this._options.intervals[key] > value);
    const keyOfInfimum =
      indexOfSupremum === -1
        ? intervalKeys[intervalKeys.length - 2]
        : intervalKeys[indexOfSupremum - 1];
    const keyOfSupremum = indexOfSupremum === -1 ? "max" : intervalKeys[indexOfSupremum];

    const valueSize =
      this._options.intervals[keyOfSupremum] - this._options.intervals[keyOfInfimum];
    const percentSize =
      this._getIntervalKeyAsNumber(keyOfSupremum) - this._getIntervalKeyAsNumber(keyOfInfimum);

    const intervalRatio = valueSize / percentSize;
    const fullRatio = (this._options.intervals.max - this._options.intervals.min) / 100;

    const magnificationFactor = intervalRatio / fullRatio;

    return {
      keyOfInfimum,
      keyOfSupremum,
      valueSize,
      percentSize,
      magnificationFactor,
    };
  }
  protected _getIntervalKeyAsNumber(key: keyof Required<TrackOptions>["intervals"]) {
    return key === "min" ? 0 : key === "max" ? 100 : Number.parseFloat(`${key}`);
  }

  protected _toTrackOptions(): FixedTrackOptions {
    return {
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
      formatter: typeof tooltip === "boolean" ? this._options.formatter : tooltip,
      isHidden: tooltip ? false : true,
    };
  }
  protected _toPipsOptions(): Required<PipsOptions> {
    const formatter = this._options.formatter;
    const { isHidden, density } = this._options.pips;
    let values = Array.isArray(this._options.pips.values) ? this._options.pips.values : [];

    switch (this._options.pips.mode) {
      case "count": {
        const shift =
          (this._options.intervals.max - this._options.intervals.min) /
          ((this._options.pips.values as number) - 1);

        let accumulator = this._options.intervals.min;
        for (let index = 0; index < this._options.pips.values; index++) {
          values.push(accumulator);
          accumulator += shift;
        }

        break;
      }
      case "positions": {
        const perPercent = (this._options.intervals.max - this._options.intervals.min) / 100;

        values = values.map((value) => value * perPercent);

        break;
      }
    }

    return { isHidden, values, density, formatter };
  }

  protected _toThumbState(index: number): ThumbState {
    const tooltipOptions = this._toTooltipOptions(index);

    const values = this._state.value;
    const value = values[index];
    return {
      ariaOrientation: this._options.orientation,
      ariaValueMin: values[index - 1] ? values[index - 1] : this._options.intervals.min,
      ariaValueMax: values[index + 1] ? values[index + 1] : this._options.intervals.max,
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
      const thumbElem = (event.target as HTMLElement).closest(
        ".range-slider__thumb-origin"
      ) as HTMLElement;

      const thumbConstants = this._getThumbConstants(thumbElem);

      switch (event.type) {
        case "pointerdown": {
          const pointerEvent = event as PointerEvent;

          thumbElem.setPointerCapture(pointerEvent.pointerId);

          const moveThumbTo = (pointerEvent: PointerEvent) => {
            if (pointerEvent.movementX === 0) return;

            const newCalculated = thumbConstants.getCalculated();

            let thumbValue = this._state.value[thumbConstants.thumbIndex];
            let currentIntervalInfo = this._getIntervalInfoByPoint(thumbValue);

            if (currentIntervalInfo.magnificationFactor !== undefined) {
              const ariaValueMin = this._state.value[thumbConstants.thumbIndex - 1]
                ? this._state.value[thumbConstants.thumbIndex - 1]
                : this._options.intervals.min;
              const ariaValueMax = this._state.value[thumbConstants.thumbIndex + 1]
                ? this._state.value[thumbConstants.thumbIndex + 1]
                : this._options.intervals.max;

              const thumbValueIncrementation =
                pointerEvent.movementX *
                newCalculated.valuePerPx *
                currentIntervalInfo.magnificationFactor;

              thumbValue += thumbValueIncrementation;

              let isLessThanInfimum, isMoreThanSupremum;
              while (
                (isMoreThanSupremum =
                  currentIntervalInfo.keyOfSupremum !== undefined &&
                  thumbValue > this._options.intervals[currentIntervalInfo.keyOfSupremum]) ||
                (isLessThanInfimum =
                  currentIntervalInfo.keyOfInfimum !== undefined &&
                  thumbValue < this._options.intervals[currentIntervalInfo.keyOfInfimum])
              ) {
                const key = (isMoreThanSupremum
                  ? currentIntervalInfo.keyOfSupremum
                  : isLessThanInfimum
                  ? currentIntervalInfo.keyOfInfimum
                  : null) as string;
                const nextIntervalInfo = this._getIntervalInfoByPoint(thumbValue);

                if (
                  currentIntervalInfo.magnificationFactor !== undefined &&
                  nextIntervalInfo.magnificationFactor !== undefined
                ) {
                  const thumbValueBeforeIncrementation = thumbValue - thumbValueIncrementation;
                  const complementToWholeIntervalValue =
                    this._options.intervals[key] - thumbValueBeforeIncrementation;

                  const toWholeIntervalFactor =
                    complementToWholeIntervalValue / thumbValueIncrementation;
                  const toNewValueFactor = 1 - toWholeIntervalFactor;

                  thumbValue =
                    thumbValueBeforeIncrementation +
                    pointerEvent.movementX *
                      newCalculated.valuePerPx *
                      (toWholeIntervalFactor * currentIntervalInfo.magnificationFactor +
                        toNewValueFactor * nextIntervalInfo.magnificationFactor);
                }

                currentIntervalInfo = this._getIntervalInfoByPoint(thumbValue);
              }
              if (thumbValue <= ariaValueMin) {
                thumbValue = ariaValueMin;
              }
              if (thumbValue >= ariaValueMax) {
                thumbValue = ariaValueMax;
              }

              this._state.value[thumbConstants.thumbIndex] = thumbValue;
              this._setState({
                value: this._state.value,
              });
            }
          };

          thumbElem.addEventListener("pointermove", moveThumbTo);
          thumbElem.addEventListener(
            "lostpointercapture",
            (event) => {
              thumbElem.removeEventListener("pointermove", moveThumbTo);
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

    return {
      thumbIndex,
      trackValueSize,
      getCalculated() {
        const valuePerPx = trackValueSize / trackElem.getBoundingClientRect().width;

        return {
          valuePerPx,
        };
      },
    };
  }
  protected _thumbValueToPositionOnTrack(thumbIndex: number) {
    const TRACK_RELATIVE_SIZE_IN_PERCENT = 100;
    const ORIGIN_THUMB_RELATIVE_SIZE_IN_PERCENT = 5;
    const THUMB_SCALE_FACTOR =
      TRACK_RELATIVE_SIZE_IN_PERCENT / ORIGIN_THUMB_RELATIVE_SIZE_IN_PERCENT;

    const THUMB_TO_CENTER_OFFSET = 50;

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
          this._state.value[thumbIndex] >= this._options.intervals[intervalKey] &&
          this._state.value[thumbIndex] <= this._options.intervals[intervalKeys[index + 1]]
        ) {
          offsetOnTrackInPercent +=
            (this._state.value[thumbIndex] - this._options.intervals[intervalKey]) /
            valuePerPercentInInterval;
          isStopOffset = true;
        } else {
          offsetOnTrackInPercent += intervalPercentSize;
        }
      } else {
        return;
      }
    });

    return offsetOnTrackInPercent * THUMB_SCALE_FACTOR - THUMB_TO_CENTER_OFFSET;
  }
}

interface eventHandler {
  (values: number[], isTapped: boolean): void;
}
type Formatter = (value: number) => string;
type Mode = "intervals" | "count" | "positions" | "values";

type SubViews = {
  track: RangeSliderTrack;
  ranges: RangeSliderRangeView[];
  thumbs: RangeSliderThumbView[];
  tooltips: RangeSliderTooltipView[];
  pips: RangeSliderPips;
};
