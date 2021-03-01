import template from "./range-slider__track.view.pug";
import "./range-slider__track.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import defaultsDeep from "lodash-es/defaultsDeep";

export default interface RangeSliderTrackView extends MVPView<TrackOptions> {
  getOrientationOption(): TrackOptions["orientation"];
  getPaddingOption(): TrackOptions["padding"];
  getRangeOption(): TrackOptions["range"];
  getAnimateOption(): TrackOptions["animate"];
  setOrientationOption(orientation?: TrackOptions["orientation"]): this;
  setPaddingOption(padding?: TrackOptions["padding"]): this;
  setRangeOption(range?: TrackOptions["range"]): this;
  setAnimateOption(animate?: TrackOptions["animate"]): this;
}

export type TrackOptions = {
  orientation?: "horizontal" | "vertical";
  padding?: number | [number, number];
  range?: {
    min?: number;
    max?: number;
    [key: string]: number | undefined;
  };

  animate?: (timeFraction: number) => number;
};

export const DEFAULT_OPTIONS: Required<TrackOptions> = {
  orientation: "horizontal",
  padding: 0,
  range: {
    min: 0,
    max: 10000,
  },
  animate: (timeFraction: number) => Math.pow(timeFraction, 2),
};

export default class RangeSliderTrackView {
  readonly dom: { self: HTMLElement };

  private _options: Required<TrackOptions>;

  constructor(container: HTMLElement, options: TrackOptions = DEFAULT_OPTIONS) {
    this.dom = { self: container };
    this._options = defaultsDeep(options, DEFAULT_OPTIONS);

    this._fixOptions();
  }

  private _fixOptions(): void {
    let fixOptionMethodName;
    Object.keys(this._options).forEach((option) => {
      fixOptionMethodName = `_fix${option[0].toUpperCase() + option.slice(1)}Option`;
      if (this[fixOptionMethodName]) this[fixOptionMethodName]();
    });
  }
  private _fixPaddingOption() {
    if (!Array.isArray(this._options.padding)) {
      this._options.padding = [this._options.padding, this._options.padding];
    }
    this._options.padding.forEach((padding, index) => {
      if (padding < 0) this._options.padding[index] = 0;
      if (padding > 50) this._options.padding[index] = 50;
    });
  }
  private _fixRangeOption() {
    const rangeKeys = Object.keys(this._options.range).sort((a, b) => {
      if (a === "min" || b === "max") {
        return -1;
      }
      if (a === "max" || b === "min") {
        return 1;
      }
      return parseFloat(a) - parseFloat(b);
    });
    let parsedKey: number;
    rangeKeys.forEach((key, index, keys) => {
      if (!(key === "min" || key === "max")) {
        parsedKey = parseFloat(key);
        if (typeof key !== "number" && parsedKey > 0 && parsedKey < 100) {
          this._options.range[`${parsedKey}%`] = this._options.range[key];
        }
        delete this._options.range[key];
        key = `${parsedKey}%`;
      }

      if ((this._options.range[key] as number) < 0) {
        this._options.range[key] = 0;
      }
      if ((this._options.range[key] as number) > Number.MAX_VALUE) {
        this._options.range[key] = Number.MAX_VALUE;
      }

      let buf;
      if (index > 0) {
        if (
          (this._options.range[key] as number) < (this._options.range[keys[index - 1]] as number)
        ) {
          buf = this._options.range[key];
          this._options.range[key] = this._options.range[keys[index - 1]];
          this._options.range[keys[index - 1]] = buf;
        }
      }
    });
  }
}
