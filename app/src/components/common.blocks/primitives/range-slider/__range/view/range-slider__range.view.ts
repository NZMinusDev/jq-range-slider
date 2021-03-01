import template from "./range-slider__range.view.pug";
import "./range-slider__range.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import defaultsDeep from "lodash-es/defaultsDeep";

export default interface RangeSliderRangeView extends MVPView<RangeOptions> {
  getConnectOption(): RangeOptions["isConnected"];
  setConnectOption(connect?: RangeOptions["isConnected"]): this;
  getStepOption(): RangeOptions["step"];
  setStepOption(step?: RangeOptions["step"]): this;
}

export type RangeOptions = {
  isConnected?: boolean;
  step?: number | "none";
};

export const DEFAULT_OPTIONS: Required<RangeOptions> = {
  isConnected: false,
  step: "none",
};

export default class RangeSliderRangeView {
  readonly dom: { self: HTMLElement };

  private _options: Required<RangeOptions>;

  constructor(container: HTMLElement, options: RangeOptions = DEFAULT_OPTIONS) {
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
  private _fixStepOption() {
    if (this._options.step !== "none") {
      if (this._options.step <= 0) this._options.step = 1;
      if (this._options.step > Number.MAX_VALUE) this._options.step = Number.MAX_VALUE;
    }
  }
}
