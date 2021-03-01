import template from "./range-slider__pips.view.pug";
import "./range-slider__pips.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import defaultsDeep from "lodash-es/defaultsDeep";
import { getPrecision } from "@utils/devTools/tools/ParserHelper";

export default interface RangeSliderPipsView extends MVPView<PipsOptions> {
  getModeOption(): PipsOptions["mode"];
  getAmountOption(): PipsOptions["amount"];
  getDensityOption(): PipsOptions["density"];
  getFormatterOption(): PipsOptions["formatter"];
  setModeOption(mode?: PipsOptions["mode"]): this;
  setAmountOption(amount?: PipsOptions["amount"]): this;
  setDensityOption(density?: PipsOptions["density"]): this;
  setFormatterOption(formatter?: PipsOptions["formatter"]): this;
}

export type PipsOptions = {
  mode?: Mode;
  amount?: number;
  density?: number;
  formatter?: Formatter;
};

export const DEFAULT_OPTIONS: Required<PipsOptions> = {
  mode: "range",
  amount: 2,
  density: 0,
  formatter: {
    to: (value: number) => value.toLocaleString(),
    from: (value: string) => +parseFloat(value.replace(/[^0-9-.]/g, "")).toFixed(2),
  },
};

export default class RangeSliderPipsView {
  readonly dom: { self: HTMLElement };

  private _options: Required<PipsOptions>;

  constructor(container: HTMLElement, options: PipsOptions = DEFAULT_OPTIONS) {
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
  private _fixAmountOption() {
    this._options.amount =
      this._options.amount < DEFAULT_OPTIONS["amount"] || getPrecision(this._options.amount) > 0
        ? DEFAULT_OPTIONS["amount"]
        : this._options.amount;
    this._options.amount = parseInt(`${this._options.amount}`);
  }
  private _fixDensityOption() {
    this._options.density =
      this._options.density < DEFAULT_OPTIONS["density"] || getPrecision(this._options.density) > 0
        ? DEFAULT_OPTIONS["density"]
        : this._options.density;
    this._options.density = parseInt(`${this._options.density}`);
  }
}

type Mode = "range" | "count";
type Formatter = { to: (value: number) => string; from: (value: string) => number };
