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

export default class RangeSliderView {
  readonly dom: { self: HTMLElement };

  private trackView: RangeSliderTrackView;
  private rangesViews: Array<RangeSliderRangeView>;
  private thumbsViews: Array<RangeSliderThumbView>;
  private tooltipsViews: Array<RangeSliderTooltipView> | undefined;
  private pipsView: RangeSliderPipsView | undefined;

  constructor(container: HTMLElement, private _options: RangeSliderOptions = {}) {
    this.dom = { self: container };

    this.trackView = this._initTrackView(this._toTrackOptions());
    this.rangesViews = this._initRangesViews(this._toRangesOptions());
    this.thumbsViews = this._initThumbsViews(this._toThumbsOptions());

    if (this._options.tooltips) this._initTooltipsViews(this._toTooltipsOptions());
    if (this._options.pips) this._initPipsView(this._toPipsOptions());
  }

  private _toTrackOptions(): TrackOptions {
    return {
      orientation: this._options.orientation,
      padding: this._options.padding,
      range: this._options.range,
      step: this._options.step,
      animate: this._options.animate,
    };
  }
  private _toRangesOptions(): Array<RangeOptions> {
    const rangesOptions: Array<RangeOptions> = [];
    this._options.connect?.forEach((isConnected) => {
      rangesOptions.push({ isConnected });
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
    if (this.trackView) {
      Object.assign(this._options, this.trackView.getOptions());
    }
  }
  private _synchronizeWithRangesOptions() {
    if (this.rangesViews) {
      this._options.connect = [];

      this.rangesViews.forEach((rangeView) => {
        this._options.connect?.push(rangeView.getConnectOption());
      });
    }
  }
  private _synchronizeWithThumbsOptions() {
    if (this.thumbsViews) {
      this._options.start = [];

      this.thumbsViews.forEach((thumbView) => {
        this._options.start?.push(thumbView.getStartOption());
      });
    }
  }
  private _synchronizeWithTooltipsOptions() {
    if (this.tooltipsViews) {
      this._options.tooltips = [];

      this.tooltipsViews.forEach((tooltipView) => {
        const tooltipViewOptions = tooltipView.getOptions();
        this._options.tooltips?.push(
          tooltipViewOptions.isHidden ? tooltipViewOptions.formatter : tooltipViewOptions.isHidden
        );
      });
    }
  }
  private _synchronizeWithPipsOptions() {
    if (this.pipsView) {
      const pipsViewOptions = this.pipsView.getOptions();
      delete (pipsViewOptions as PipsOptions)["formatter"];

      this._options.pips = pipsViewOptions;
    }
  }

  private _initTrackView(options: TrackOptions): RangeSliderTrackView {
    const container = document.createElement("div");

    this.trackView = new RangeSliderTrackView(container, options);
    this._synchronizeWithTrackViewOptions();

    this.dom.self.append(container);

    return this.trackView;
  }
  private _initRangesViews(options: Array<RangeOptions>): Array<RangeSliderRangeView> {
    this.rangesViews = [];

    options.forEach((rangeOptions) => {
      const container = document.createElement("div");

      this.rangesViews.push(new RangeSliderRangeView(container, rangeOptions));

      this.dom.self.append(container);
    });

    this._synchronizeWithRangesOptions();

    return this.rangesViews;
  }
  private _initThumbsViews(options: Array<ThumbOptions>): Array<RangeSliderThumbView> {
    this.thumbsViews = [];

    options.forEach((thumbOptions) => {
      const container = document.createElement("div");

      this.thumbsViews.push(new RangeSliderThumbView(container, thumbOptions));

      this.dom.self.append(container);
    });

    this._synchronizeWithThumbsOptions();

    return this.thumbsViews;
  }
  private async _initTooltipsViews(
    options: Array<TooltipOptions>
  ): Promise<Array<RangeSliderTooltipView>> {
    this.tooltipsViews = [];

    let RangeSliderTooltipViewModule = await import(
      "./../__tooltip/view/range-slider__tooltip.view"
    );

    options.forEach((tooltipOptions) => {
      const container = document.createElement("div");

      this.tooltipsViews!.push(new RangeSliderTooltipViewModule.default(container, tooltipOptions));

      this.dom.self.append(container);
    });

    this._synchronizeWithTooltipsOptions();

    return this.tooltipsViews;
  }
  private async _initPipsView(options: PipsOptions): Promise<RangeSliderPipsView> {
    const container = document.createElement("div");

    const RangeSliderPipsViewModule = await import("./../__pips/view/range-slider__pips.view");

    this.pipsView = new RangeSliderPipsViewModule.default(container, options);
    this._synchronizeWithPipsOptions();

    this.dom.self.append(container);

    return this.pipsView;
  }
}

export type RangeSliderOptions = {
  start?: Array<ThumbOptions["start"]>;
  range?: TrackOptions["range"];
  step?: TrackOptions["step"];
  connect?: Array<RangeOptions["isConnected"]>;
  orientation?: TrackOptions["orientation"];
  padding?: TrackOptions["padding"];
  animate?: TrackOptions["animate"];
  formatter?: Formatter;
  tooltips?: Array<TooltipOptions["formatter"] | boolean>;
  pips?: Omit<PipsOptions, "formatter">;
};

interface eventHandler {
  (values: Array<number>, isTapped: boolean): void;
}
type Formatter = { to: (value: number) => string; from: (value: string) => number };
