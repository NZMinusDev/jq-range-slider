import template from "./range-slider__thumb.view.pug";
import "./range-slider__thumb.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import defaultsDeep from "lodash-es/defaultsDeep";

export default interface RangeSliderThumbView extends MVPView<ThumbOptions> {
  getId(): Id;
  getStartOption(): ThumbOptions["start"];
  setStartOption(start?: ThumbOptions["start"]): this;
}

export type ThumbOptions = { start?: number };

export const DEFAULT_OPTIONS: Required<ThumbOptions> = {
  start: 0,
};

export default class RangeSliderThumbView {
  readonly dom: { self: HTMLElement };

  private _id: number;
  private _options: Required<ThumbOptions>;

  constructor(container: HTMLElement, options: ThumbOptions = DEFAULT_OPTIONS) {
    this._id = new Date().getTime();

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
  private _fixStartOption() {
    this._options.start =
      this._options.start < DEFAULT_OPTIONS["start"]
        ? DEFAULT_OPTIONS["start"]
        : this._options.start;
  }
}

export type Id = number;
