import "./range-slider__thumb.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderThumbView {
  getId(): Id;
  getStartOption(): ThumbOptions["start"];
  setStartOption(start?: ThumbOptions["start"]): this;
}

export type ThumbOptions = { start?: number };

export const DEFAULT_OPTIONS: Required<ThumbOptions> = {
  start: 0,
};

export default class RangeSliderThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions>
  implements RangeSliderThumbView {
  protected _id: number;

  constructor(container: HTMLElement, options: ThumbOptions = DEFAULT_OPTIONS) {
    super(container, DEFAULT_OPTIONS, options, ["start"]);

    this._id = new Date().getTime();
  }

  getId() {
    return this._id;
  }
  getStartOption() {
    return this._options.start;
  }

  setStartOption(start: ThumbOptions["start"] = DEFAULT_OPTIONS.start) {
    this._options.start = start;
    this._fixStartOption();

    return this;
  }

  protected _fixStartOption() {
    this._options.start =
      this._options.start > Number.MAX_SAFE_INTEGER
        ? Number.MAX_SAFE_INTEGER
        : this._options.start < Number.MIN_SAFE_INTEGER
        ? Number.MIN_SAFE_INTEGER
        : this._options.start;

    return this;
  }
}

export type Id = number;
