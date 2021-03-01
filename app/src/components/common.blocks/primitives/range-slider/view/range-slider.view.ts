import template from "./range-slider.view.pug";
import "./range-slider.scss";

import RangeSliderTrackView, { TrackOptions } from "./../__track/view/range-slider__track.view";
import RangeSliderRangeView, { RangeOptions } from "./../__range/view/range-slider__range.view";
import RangeSliderThumbView, { ThumbOptions } from "./../__thumb/view/range-slider__thumb.view";
import RangeSliderTooltipView, {
  TooltipOptions,
} from "./../__tooltip/view/range-slider__tooltip.view";
import RangeSliderPipsView, { PipsOptions } from "./../__pips/view/range-slider__pips.view";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderView extends MVPView<RangeSliderOptions> {
  getStartOption(): RangeSliderOptions["start"];
  getRangeOption(): RangeSliderOptions["range"];
  getStepOption(): RangeSliderOptions["step"];
  getConnectOption(): RangeSliderOptions["connect"];
  getOrientationOption(): RangeSliderOptions["orientation"];
  getPaddingOption(): RangeSliderOptions["padding"];
  getAnimateOption(): RangeSliderOptions["animate"];
  getFormatterOption(): RangeSliderOptions["formatter"];
  getTooltipsOption(): RangeSliderOptions["tooltips"];
  getPipsOption(): RangeSliderOptions["pips"];
  setStartOption(start?: RangeSliderOptions["start"]): this;
  setRangeOption(range?: RangeSliderOptions["range"]): this;
  setStepOption(step?: RangeSliderOptions["step"]): this;
  setConnectOption(connect?: RangeSliderOptions["connect"]): this;
  setOrientationOption(orientation?: RangeSliderOptions["orientation"]): this;
  setPaddingOption(padding?: RangeSliderOptions["padding"]): this;
  setAnimateOption(animate?: RangeSliderOptions["animate"]): this;
  setFormatterOption(formatter?: RangeSliderOptions["formatter"]): this;
  setTooltipsOption(tooltips?: RangeSliderOptions["tooltips"]): this;
  setPipsOption(pips?: RangeSliderOptions["pips"]): this;

  getValue(): Array<number>;
  setValue(value?: number | Array<number>): this;

  whenIsStarted(callback: eventHandler): void;
  whenIsSlid(callback: eventHandler): void;
  whenIsUpdated(callback: eventHandler): void;
  whenIsChanged(callback: eventHandler): void;
  whenIsSet(callback: eventHandler): void;
  whenIsEnded(callback: eventHandler): void;
}

export type RangeSliderOptions = {
  start?: Array<ThumbOptions["start"]>;
  range?: TrackOptions["range"];
  step?: RangeOptions["step"] | Array<RangeOptions["step"]>;
  connect?: Array<RangeOptions["isConnected"]>;
  orientation?: TrackOptions["orientation"];
  padding?: TrackOptions["padding"];
  animate?: TrackOptions["animate"];
  formatter?: Formatter;
  tooltips?: Array<TooltipOptions["formatter"] | boolean>;
  pips?: Omit<PipsOptions, "formatter">;
};

export const DEFAULT_OPTIONS = {} as Required<RangeSliderOptions>;

export default class RangeSliderView {
  readonly dom: { self: HTMLElement };

  private _trackView: RangeSliderTrackView;
  private _rangesViews: Array<RangeSliderRangeView>;
  private _thumbsViews: Array<RangeSliderThumbView>;
  private _tooltipsViews: Array<RangeSliderTooltipView> | undefined;
  private _pipsView: RangeSliderPipsView | undefined;

  constructor(container: HTMLElement, private _options: RangeSliderOptions = {}) {
    this.dom = { self: container };

    this._trackView = this._initTrackView(this._toTrackOptions());
    this._rangesViews = this._initRangesViews(this._toRangesOptions());
    this._thumbsViews = this._initThumbsViews(this._toThumbsOptions());

    if (this._options.tooltips) this._initTooltipsViews(this._toTooltipsOptions());
    if (this._options.pips) this._initPipsView(this._toPipsOptions());
  }

  private _toTrackOptions(): TrackOptions {
    return {
      orientation: this._options.orientation,
      padding: this._options.padding,
      range: this._options.range,
      animate: this._options.animate,
    };
  }
  private _toRangesOptions(): Array<RangeOptions> {
    const rangesOptions: Array<RangeOptions> = [];
    this._options.connect?.forEach((isConnected, index) => {
      rangesOptions.push({
        isConnected,
        step: Array.isArray(this._options.step) ? this._options.step[index] : this._options.step,
      });
    });

    return rangesOptions;
  }
  private _toThumbsOptions(): Array<ThumbOptions> {
    const thumbsOptions: Array<ThumbOptions> = [];
    this._options.start?.forEach((start) => {
      thumbsOptions.push({ start });
    });

    return thumbsOptions;
  }
  private _toTooltipsOptions(): Array<TooltipOptions> {
    const tooltipsOptions: Array<TooltipOptions> = [];
    this._options.tooltips?.forEach((tooltip) => {
      tooltipsOptions.push({
        formatter: typeof tooltip === "boolean" ? this._options.formatter : tooltip,
        isHidden: tooltip ? true : false,
      });
    });

    return tooltipsOptions;
  }
  private _toPipsOptions(): PipsOptions {
    let pipsOptions: PipsOptions = {};
    const formatter = this._options.formatter;
    pipsOptions = Object.assign({ formatter }, this._options.pips);

    return pipsOptions;
  }

  private _synchronizeWithTrackViewOptions() {
    if (this._trackView) {
      Object.assign(this._options, this._trackView.getOptions());
    }
  }
  private _synchronizeWithRangesOptions() {
    if (this._rangesViews) {
      this._options.connect = [];

      this._rangesViews.forEach((rangeView) => {
        this._options.connect?.push(rangeView.getConnectOption());
      });
    }
  }
  private _synchronizeWithThumbsOptions() {
    if (this._thumbsViews) {
      this._options.start = [];

      this._thumbsViews.forEach((thumbView) => {
        this._options.start?.push(thumbView.getStartOption());
      });
    }
  }
  private _synchronizeWithTooltipsOptions() {
    if (this._tooltipsViews) {
      this._options.tooltips = [];

      this._tooltipsViews.forEach((tooltipView) => {
        const tooltipViewOptions = tooltipView.getOptions();
        this._options.tooltips?.push(
          tooltipViewOptions.isHidden ? tooltipViewOptions.formatter : tooltipViewOptions.isHidden
        );
      });
    }
  }
  private _synchronizeWithPipsOptions() {
    if (this._pipsView) {
      const pipsViewOptions = this._pipsView.getOptions();
      delete (pipsViewOptions as PipsOptions)["formatter"];

      this._options.pips = pipsViewOptions;
    }
  }

  private _initTrackView(options: TrackOptions): RangeSliderTrackView {
    const container = document.createElement("div");

    this._trackView = new RangeSliderTrackView(container, options);
    this._synchronizeWithTrackViewOptions();

    this.dom.self.append(container);

    return this._trackView;
  }
  private _initRangesViews(options: Array<RangeOptions>): Array<RangeSliderRangeView> {
    this._rangesViews = [];

    options.forEach((rangeOptions) => {
      const container = document.createElement("div");

      this._rangesViews.push(new RangeSliderRangeView(container, rangeOptions));

      this.dom.self.append(container);
    });

    this._synchronizeWithRangesOptions();

    return this._rangesViews;
  }
  private _initThumbsViews(options: Array<ThumbOptions>): Array<RangeSliderThumbView> {
    this._thumbsViews = [];

    options.forEach((thumbOptions) => {
      const container = document.createElement("div");

      this._thumbsViews.push(new RangeSliderThumbView(container, thumbOptions));

      this.dom.self.append(container);
    });

    this._synchronizeWithThumbsOptions();

    return this._thumbsViews;
  }
  private async _initTooltipsViews(
    options: Array<TooltipOptions>
  ): Promise<Array<RangeSliderTooltipView>> {
    this._tooltipsViews = [];

    let RangeSliderTooltipViewModule = await import(
      "./../__tooltip/view/range-slider__tooltip.view"
    );

    options.forEach((tooltipOptions) => {
      const container = document.createElement("div");

      this._tooltipsViews!.push(
        new RangeSliderTooltipViewModule.default(container, tooltipOptions)
      );

      this.dom.self.append(container);
    });

    this._synchronizeWithTooltipsOptions();

    return this._tooltipsViews;
  }
  private async _initPipsView(options: PipsOptions): Promise<RangeSliderPipsView> {
    const container = document.createElement("div");

    const RangeSliderPipsViewModule = await import("./../__pips/view/range-slider__pips.view");

    this._pipsView = new RangeSliderPipsViewModule.default(container, options);
    this._synchronizeWithPipsOptions();

    this.dom.self.append(container);

    return this._pipsView;
  }
}

interface eventHandler {
  (values: Array<number>, isTapped: boolean): void;
}
type Formatter = { to: (value: number) => string; from: (value: string) => number };
