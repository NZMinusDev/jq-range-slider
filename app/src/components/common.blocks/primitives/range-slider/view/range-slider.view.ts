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
  TooltipState,
} from "./../__tooltip/view/range-slider__tooltip.view";
import RangeSliderPipsView, {
  DEFAULT_OPTIONS as PIPS_DEFAULT_OPTIONS,
  PipsOptions,
} from "./../__pips/view/range-slider__pips.view";

import { defaultsDeep } from "lodash-es";
import { html, TemplateResult } from "lit-html";
import { styleMap, StyleInfo } from "lit-html/directives/style-map";
import { classMap, ClassInfo } from "lit-html/directives/class-map";

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
export type RangeSliderState = {};

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
  values: DEFAULT_OPTIONS.start,
};

const VALUES_CALCULATION_PRECISION = 2;
export default class RangeSliderView
  extends MVPView<FixedRangeSliderOptions, RangeSliderOptions, RangeSliderState, "", SubViews>
  implements RangeSliderView {
  readonly template = (classInfo: ClassInfo, styleInfo: StyleInfo) => html`<div
    class=${classMap(
      Object.assign(
        {},
        { "range-slider": true, ["range-slider_orientation-" + this._options.orientation]: true },
        classInfo
      )
    )}
    style=${styleMap(Object.assign({}, {}, styleInfo))}
  >
    ${this._subViews.trackView.template(
      {},
      {},
      ([] as TemplateResult[]).concat(
        this._subViews.rangesView.map((view) => view.template({}, {})),
        this._subViews.thumbsView.map((view, index, views) => {
          const baseZIndex = 2;
          const nextIndex = index + 1;
          const rangeOfSwapZIndex =
            (this._options.intervals.max - this._options.intervals.min) * 0.02;

          return view.template(
            {},
            {
              zIndex:
                view.getAriaValueNowState() >
                  views[nextIndex]?.getAriaValueNowState() - rangeOfSwapZIndex &&
                view.getAriaValueMinState() < views[nextIndex]?.getAriaValueMinState()
                  ? baseZIndex + views.length - index + 1 + ""
                  : baseZIndex + index + "",
            },
            this._subViews.tooltipsView[index].template({}, {})
          );
        })
      )
    )}
    ${this._subViews.pipsView.template({}, {})}
  </div>`;

  constructor(
    options: RangeSliderOptions = DEFAULT_OPTIONS,
    state: RangeSliderState = DEFAULT_STATE
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
      theOrderOfIteratingThroughTheState: [],
      theOrderOfIteratingThroughTheSubViews: ["track", "ranges", "thumbs", "tooltips", "pips"],
    });
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

  protected _toTooltipsState() {
    const tooltipsState: TooltipState[] = [];

    this._options.tooltips.forEach((tooltip, index) => {
      tooltipsState.push({
        value: this._subViews.thumbsView[index].getAriaValueNowState(),
      });
    });

    return tooltipsState;
  }

  protected _synchronizeWithTrackViewOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._subViews.trackView.setOptions(this._toTrackOptions());
    }
    const { intervals, steps, padding } = this._subViews.trackView.getOptions();

    this._options.intervals = intervals;
    this._options.steps = steps;
    this._options.padding = padding;

    return this;
  }
  protected _synchronizeWithRangesOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._initRangesView(this._toRangesOptions());
    } else {
      this._subViews.rangesView.forEach((rangeView, index) => {
        const { isConnected } = rangeView.getOptions();

        this._options.connect[index] = isConnected;
      });
    }

    return this;
  }
  protected _synchronizeWithThumbsOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._initThumbsView(this._toThumbsOptions());
    } else {
      this._subViews.thumbsView.forEach((thumbView, index) => {
        const { start } = thumbView.getOptions();

        this._options.start[index] = start;
      });
    }
    return this;
  }
  protected _synchronizeWithTooltipsOptions(shouldSet: boolean = false) {
    if (shouldSet) {
      this._initTooltipsView(this._toTooltipsOptions(), this._toTooltipsState());
    } else {
      this._subViews.tooltipsView.forEach((tooltipView, index) => {
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
      this._subViews.pipsView.setOptions(this._toPipsOptions());
    }
    const { isHidden, values, density } = this._subViews.pipsView.getOptions();

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
    this._subViews.trackView = new RangeSliderTrackView(options);

    this._synchronizeWithTrackViewOptions();

    return this._subViews.trackView;
  }
  protected _initRangesView(options: RangeOptions[]): RangeSliderRangeView[] {
    if (!this._subViews.rangesView) {
      this._subViews.rangesView = [];
    }

    while (this._subViews.rangesView.length > options.length) {
      this._subViews.rangesView.pop();
    }
    this._subViews.rangesView.forEach((rangeView, index) => {
      rangeView.setOptions(options[index]);
    });
    while (this._subViews.rangesView.length < options.length) {
      this._subViews.rangesView.push(
        new RangeSliderRangeView(options[this._subViews.rangesView.length])
      );
    }

    this._synchronizeWithRangesOptions();

    return this._subViews.rangesView;
  }
  protected _initThumbsView(options: ThumbOptions[]): RangeSliderThumbView[] {
    if (!this._subViews.thumbsView) {
      this._subViews.thumbsView = [];
    }

    while (this._subViews.thumbsView.length > options.length) {
      this._subViews.thumbsView.pop();
    }
    this._subViews.thumbsView.forEach((thumbView, index) => {
      thumbView.setOptions(options[index]);
    });
    while (this._subViews.thumbsView.length < options.length) {
      this._subViews.thumbsView.push(
        new RangeSliderThumbView(options[this._subViews.thumbsView.length])
      );
    }

    this._synchronizeWithThumbsOptions();

    return this._subViews.thumbsView;
  }
  protected _initTooltipsView(
    options: TooltipOptions[],
    state: TooltipState[]
  ): RangeSliderTooltipView[] {
    if (!this._subViews.tooltipsView) {
      this._subViews.tooltipsView = [];
    }

    while (this._subViews.tooltipsView.length > options.length) {
      this._subViews.tooltipsView.pop();
    }
    this._subViews.tooltipsView.forEach((tooltipView, index) => {
      tooltipView.setOptions(options[index]).setState(state[index]);
    });
    while (this._subViews.tooltipsView.length < options.length) {
      this._subViews.tooltipsView.push(
        new RangeSliderTooltipView(
          options[this._subViews.tooltipsView.length],
          state[this._subViews.tooltipsView.length]
        )
      );
    }

    this._synchronizeWithTooltipsOptions();

    return this._subViews.tooltipsView;
  }
  protected _initPipsView(options: PipsOptions): RangeSliderPipsView {
    this._subViews.pipsView = new RangeSliderPipsView(options);

    this._synchronizeWithPipsOptions();

    return this._subViews.pipsView;
  }

  protected _render() {
    if (
      this._subViews.thumbsView.length === this._subViews.tooltipsView.length &&
      this._subViews.thumbsView.length === this._subViews.rangesView.length - 1
    ) {
      super._render();

      this._subViews.thumbsView.forEach((thumbView) => {
        thumbView.on("pointerdown", this._thumbEventListenerObject);
      });
    }

    return this;
  }
  protected _thumbEventListenerObject = {
    handleEvent: ({ view, event }: { view: RangeSliderThumbView; event: Event }) => {
      const thumbElem = (event.target as HTMLElement).closest(
        ".range-slider__thumb"
      ) as HTMLElement;
      const trackElem = thumbElem.closest(".range-slider__track") as HTMLElement;

      const thumbViewIndex = this._subViews.thumbsView.findIndex((thumbView) => thumbView === view);

      const trackCoords = trackElem.getBoundingClientRect();
      const thumbCoords = thumbElem.getBoundingClientRect();
      const thumbScaleXToTrackMultiplier = 100 / thumbCoords.width;
      const thumbOffsetXToCenter = thumbCoords.width / 2;
      const trackValueSize = this._options.intervals.max - this._options.intervals.min;
      const valuePerPx = trackValueSize / trackCoords.width;

      switch (event.type) {
        case "pointerdown": {
          const pointerEvent = event as PointerEvent;

          thumbElem.setPointerCapture(pointerEvent.pointerId);

          let newThumbPositionOnTrack = thumbCoords.left - trackCoords.left + thumbOffsetXToCenter;
          const moveThumbTo = (pointerEvent: PointerEvent) => {
            const ariaValueMin = this._subViews.thumbsView[thumbViewIndex - 1]
              ? this._subViews.thumbsView[thumbViewIndex - 1].getAriaValueNowState()
              : this._options.intervals.min;
            const ariaValueMax = this._subViews.thumbsView[thumbViewIndex + 1]
              ? this._subViews.thumbsView[thumbViewIndex + 1].getAriaValueNowState()
              : this._options.intervals.max;

            newThumbPositionOnTrack += pointerEvent.movementX;
            //FIXME: add coefficient of non linear
            let thumbValue =
              newThumbPositionOnTrack * valuePerPx - Math.abs(this._options.intervals.min);

            if (thumbValue < ariaValueMin) {
              newThumbPositionOnTrack =
                (ariaValueMin + Math.abs(this._options.intervals.min)) / valuePerPx;
              thumbValue = ariaValueMin;
            }
            if (thumbValue > ariaValueMax) {
              newThumbPositionOnTrack =
                (ariaValueMax + Math.abs(this._options.intervals.min)) / valuePerPx;
              thumbValue = ariaValueMax;
            }

            view.setState({
              ariaOrientation: this._options.orientation,
              ariaValueMin,
              ariaValueMax,
              ariaValueNow: +thumbValue.toFixed(2),
              ariaValueText: this._options.formatter(thumbValue),
            });
            this._subViews.tooltipsView[thumbViewIndex].setState({
              value: this._subViews.tooltipsView[thumbViewIndex].getFormatterOption()(thumbValue),
            });

            thumbElem.style.transform = `translate(${
              (newThumbPositionOnTrack - thumbOffsetXToCenter) * thumbScaleXToTrackMultiplier
            }%,0)`;
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
}

interface eventHandler {
  (values: number[], isTapped: boolean): void;
}
type Formatter = (value: number) => string;
type Mode = "intervals" | "count" | "positions" | "values";

type SubViews = {
  trackView: RangeSliderTrackView;
  rangesView: RangeSliderRangeView[];
  thumbsView: RangeSliderThumbView[];
  tooltipsView: RangeSliderTooltipView[];
  pipsView: RangeSliderPipsView;
};
