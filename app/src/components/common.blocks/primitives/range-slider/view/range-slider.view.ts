import "./range-slider.scss";

import RangeSliderTrackView, {
  DEFAULT_OPTIONS as TRACK_DEFAULT_OPTIONS,
  FixedTrackOptions,
  TrackOptions,
} from "./../__track/view/range-slider__track.view";
import RangeSliderRangeView, {
  DEFAULT_OPTIONS as RANGE_DEFAULT_OPTIONS,
  RangeOptions,
} from "./../__range/view/range-slider__range.view";
import RangeSliderThumbView, {
  DEFAULT_OPTIONS as THUMB_DEFAULT_OPTIONS,
  ThumbOptions,
} from "./../__thumb/view/range-slider__thumb.view";
import RangeSliderTooltipView, {
  TooltipOptions,
} from "./../__tooltip/view/range-slider__tooltip.view";
import RangeSliderPipsView, {
  DEFAULT_OPTIONS as PIPS_DEFAULT_OPTIONS,
  PipsOptions,
} from "./../__pips/view/range-slider__pips.view";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import { defaultsDeep } from "lodash-es";
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

  get(): number[];
  set(value?: number | number[]): this;

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
  orientation?: TrackOptions["orientation"];
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

export const DEFAULT_OPTIONS: FixedRangeSliderOptions = {
  intervals: TRACK_DEFAULT_OPTIONS.intervals,
  start: [THUMB_DEFAULT_OPTIONS.start],
  steps: TRACK_DEFAULT_OPTIONS.steps,
  connect: [RANGE_DEFAULT_OPTIONS.isConnected, RANGE_DEFAULT_OPTIONS.isConnected],
  orientation: TRACK_DEFAULT_OPTIONS.orientation,
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

const VALUES_CALCULATION_PRECISION = 2;
export default class RangeSliderView
  extends MVPView<FixedRangeSliderOptions, RangeSliderOptions>
  implements RangeSliderView {
  protected _trackView: RangeSliderTrackView;
  protected _rangesViews: RangeSliderRangeView[];
  protected _thumbsViews: RangeSliderThumbView[];
  protected _tooltipsViews: RangeSliderTooltipView[];
  protected _pipsView: RangeSliderPipsView;

  constructor(container: HTMLElement, options: RangeSliderOptions = DEFAULT_OPTIONS) {
    super(container, DEFAULT_OPTIONS, options, [
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
    ]);

    this._trackView = this._initTrackView(this._toTrackOptions());
    this._rangesViews = this._initRangesViews(this._toRangesOptions());
    this._thumbsViews = this._initThumbsViews(this._toThumbsOptions());
    this._tooltipsViews = this._initTooltipsViews(this._toTooltipsOptions());
    this._pipsView = this._initPipsView(this._toPipsOptions());
  }

  getIntervalsOption() {
    return Object.assign({}, this._options.intervals);
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
    this._options.intervals = intervals;

    this._synchronizeWithTrackViewOptions(true)
      ._fixStartOption()
      ._fixPipsOption()
      ._synchronizeWithThumbsOptions(true)
      ._synchronizeWithPipsOptions(true);

    return this;
  }
  setStartOption(start: RangeSliderOptions["start"] = DEFAULT_OPTIONS.start) {
    this._options.start = Array.isArray(start)
      ? ([] as FixedRangeSliderOptions["start"]).concat(start)
      : this._options.start.fill(start);

    this._fixStartOption()
      ._synchronizeWithThumbsOptions(true)
      ._fixConnectOption()
      ._synchronizeWithRangesOptions(true)
      ._fixTooltipsOption()
      ._synchronizeWithTooltipsOptions(true);

    return this;
  }
  setStepsOption(steps: RangeSliderOptions["steps"] = DEFAULT_OPTIONS.steps) {
    this._options.steps = steps as FixedRangeSliderOptions["steps"];

    this._synchronizeWithTrackViewOptions(true);

    return this;
  }
  setConnectOption(connect: RangeSliderOptions["connect"] = DEFAULT_OPTIONS.connect) {
    this._options.connect = Array.isArray(connect)
      ? ([] as FixedRangeSliderOptions["connect"]).concat(connect)
      : this._options.connect.fill(connect);

    this._fixConnectOption()._synchronizeWithRangesOptions(true);

    return this;
  }
  setOrientationOption(
    orientation: RangeSliderOptions["orientation"] = DEFAULT_OPTIONS.orientation
  ) {
    this._options.orientation = orientation;

    this._synchronizeWithTrackViewOptions(true);

    return this;
  }
  setPaddingOption(padding: RangeSliderOptions["padding"] = DEFAULT_OPTIONS.padding) {
    this._options.padding = padding as FixedRangeSliderOptions["padding"];

    this._synchronizeWithTrackViewOptions(true);

    return this;
  }
  setFormatterOption(formatter: RangeSliderOptions["formatter"] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    this._fixTooltipsOption()
      ._synchronizeWithTooltipsOptions(true)
      ._synchronizeWithPipsOptions(true);

    return this;
  }
  setTooltipsOption(tooltips: RangeSliderOptions["tooltips"] = DEFAULT_OPTIONS.tooltips) {
    this._options.tooltips = Array.isArray(tooltips)
      ? ([] as FixedRangeSliderOptions["tooltips"]).concat(tooltips)
      : this._options.tooltips.fill(tooltips);

    this._fixTooltipsOption()._synchronizeWithTooltipsOptions(true);

    return this;
  }
  setPipsOption(pips: RangeSliderOptions["pips"] = DEFAULT_OPTIONS.pips) {
    this._options.pips = defaultsDeep({}, pips, this._options.pips);

    this._fixPipsOption()._synchronizeWithPipsOptions(true);

    return this;
  }
  setAnimateOption(animate: RangeSliderOptions["animate"] = DEFAULT_OPTIONS.animate) {
    this._options.animate = animate;

    return this;
  }

  // remove() {
  //   this._trackView.remove();
  //   this._rangesViews.forEach((rangeView) => {
  //     rangeView.remove();
  //   });
  //   this._thumbsViews.forEach((thumbView) => {
  //     thumbView.remove();
  //   });
  //   this._tooltipsViews.forEach((tooltipView) => {
  //     tooltipView.remove();
  //   });
  //   this._pipsView.remove();
  // }

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

  protected _toTrackOptions(): FixedTrackOptions {
    return {
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      steps: this._options.steps,
      padding: this._options.padding,
    };
  }
  protected _toRangesOptions(): Required<RangeOptions>[] {
    const rangesOptions: Required<RangeOptions>[] = [];
    this._options.connect.forEach((isConnected) => {
      rangesOptions.push({
        isConnected,
      });
    });

    return rangesOptions;
  }
  protected _toThumbsOptions(): Required<ThumbOptions>[] {
    const thumbsOptions: Required<ThumbOptions>[] = [];
    this._options.start.forEach((start) => {
      thumbsOptions.push({ start });
    });

    return thumbsOptions;
  }
  protected _toTooltipsOptions(): Required<TooltipOptions>[] {
    const tooltipsOptions: Required<TooltipOptions>[] = [];
    this._options.tooltips.forEach((tooltip) => {
      tooltipsOptions.push({
        formatter: typeof tooltip === "boolean" ? this._options.formatter : tooltip,
        isHidden: tooltip ? false : true,
      });
    });

    return tooltipsOptions;
  }
  protected _toPipsOptions() {
    let pipsOptions: Required<PipsOptions>;

    const formatter = this._options.formatter;
    const { isHidden, density } = this._options.pips;
    let values = Array.isArray(this._options.pips.values) ? this._options.pips.values : [];

    switch (this._options.pips.mode) {
      case "count": {
        const shift = +(
          (this._options.intervals.max - this._options.intervals.min) /
          ((this._options.pips.values as number) - 1)
        ).toFixed(VALUES_CALCULATION_PRECISION);

        let accumulator = this._options.intervals.min;
        for (let index = 0; index < this._options.pips.values; index++) {
          values.push(accumulator);
          accumulator += shift;
        }

        break;
      }
      case "positions": {
        const perPercent = +(
          (this._options.intervals.max - this._options.intervals.min) /
          100
        ).toFixed(VALUES_CALCULATION_PRECISION);

        values = values.map((value) => value * perPercent);

        break;
      }
    }

    pipsOptions = Object.assign({ formatter }, { isHidden, values, density, formatter });

    return pipsOptions;
  }

  protected _synchronizeWithTrackViewOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._trackView.setOptions(this._toTrackOptions());
    }
    const { orientation, intervals, steps, padding } = this._trackView.getOptions();

    this._options.orientation = orientation;
    this._options.intervals = intervals;
    this._options.steps = steps;
    this._options.padding = padding;

    return this;
  }
  protected _synchronizeWithRangesOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._initRangesViews(this._toRangesOptions());
    } else {
      this._rangesViews.forEach((rangeView, index) => {
        const { isConnected } = rangeView.getOptions();

        this._options.connect[index] = isConnected;
      });
    }

    return this;
  }
  protected _synchronizeWithThumbsOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._initThumbsViews(this._toThumbsOptions());
    } else {
      this._thumbsViews.forEach((thumbView, index) => {
        const { start } = thumbView.getOptions();

        this._options.start[index] = start;
      });
    }
    return this;
  }
  protected _synchronizeWithTooltipsOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._initTooltipsViews(this._toTooltipsOptions());
    } else {
      this._tooltipsViews.forEach((tooltipView, index) => {
        const { formatter, isHidden } = tooltipView.getOptions();

        this._options.tooltips[index] = isHidden
          ? !isHidden
          : Object.is(formatter, this._options.formatter)
          ? true
          : formatter;
      });
    }

    return this;
  }
  protected _synchronizeWithPipsOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._pipsView.setOptions(this._toPipsOptions());
    }
    const { isHidden, values, density } = this._pipsView.getOptions();

    this._options.pips = { mode: this._options.pips.mode, isHidden, values, density };

    switch (this._options.pips.mode) {
      case "count": {
        this._options.pips.values = values.length;
        break;
      }
      case "positions": {
        const perPercent = +(
          (this._options.intervals.max - this._options.intervals.min) /
          100
        ).toFixed(VALUES_CALCULATION_PRECISION);

        this._options.pips.values = values.map((value) => value / perPercent);
      }
    }

    return this;
  }

  protected _initTrackView(options: TrackOptions): RangeSliderTrackView {
    const container = document.createElement("div");

    this._trackView = new RangeSliderTrackView(container, options);

    this.dom.self.append(container);

    this._synchronizeWithTrackViewOptions();

    return this._trackView;
  }
  protected _initRangesViews(options: RangeOptions[]): RangeSliderRangeView[] {
    if (!this._rangesViews) {
      this._rangesViews = [];
    }

    while (this._rangesViews.length > options.length) {
      this._rangesViews[this._rangesViews.length - 1].remove();
      this._rangesViews.pop();
    }
    this._rangesViews.forEach((rangeView, index) => {
      rangeView.setOptions(options[index]);
    });
    while (this._rangesViews.length < options.length) {
      const container = document.createElement("div");

      this._rangesViews.push(
        new RangeSliderRangeView(container, options[this._rangesViews.length])
      );

      this.dom.self.append(container);
    }

    this._synchronizeWithRangesOptions();

    return this._rangesViews;
  }
  protected _initThumbsViews(options: ThumbOptions[]): RangeSliderThumbView[] {
    if (!this._thumbsViews) {
      this._thumbsViews = [];
    }

    while (this._thumbsViews.length > options.length) {
      this._thumbsViews[this._thumbsViews.length - 1].remove();
      this._thumbsViews.pop();
    }
    this._thumbsViews.forEach((thumbView, index) => {
      thumbView.setOptions(options[index]);
    });
    while (this._thumbsViews.length < options.length) {
      const container = document.createElement("div");

      this._thumbsViews.push(
        new RangeSliderThumbView(container, options[this._thumbsViews.length])
      );

      this.dom.self.append(container);
    }

    this._synchronizeWithThumbsOptions();

    return this._thumbsViews;
  }
  protected _initTooltipsViews(options: TooltipOptions[]): RangeSliderTooltipView[] {
    if (!this._tooltipsViews) {
      this._tooltipsViews = [];
    }

    while (this._tooltipsViews.length > options.length) {
      this._tooltipsViews[this._tooltipsViews.length - 1].remove();
      this._tooltipsViews.pop();
    }
    this._tooltipsViews.forEach((tooltipView, index) => {
      tooltipView.setOptions(options[index]);
    });
    while (this._tooltipsViews.length < options.length) {
      const container = document.createElement("div");

      this._tooltipsViews.push(
        new RangeSliderTooltipView(container, options[this._tooltipsViews.length])
      );

      this.dom.self.append(container);
    }

    this._synchronizeWithTooltipsOptions();

    return this._tooltipsViews;
  }
  protected _initPipsView(options: PipsOptions): RangeSliderPipsView {
    const container = document.createElement("div");

    this._pipsView = new RangeSliderPipsView(container, options);

    this.dom.self.append(container);

    this._synchronizeWithPipsOptions();

    return this._pipsView;
  }
}

interface eventHandler {
  (values: number[], isTapped: boolean): void;
}
type Formatter = (value: number) => string;
type Mode = "intervals" | "count" | "positions" | "values";
