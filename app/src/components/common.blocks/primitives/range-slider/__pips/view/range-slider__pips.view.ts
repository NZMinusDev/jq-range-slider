import template from "./range-slider__pips.view.pug";
import "./range-slider__pips.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import defaultsDeep from "lodash-es/defaultsDeep";
import { getPrecision, collapsingParseInt } from "@utils/devTools/tools/ParserHelper";

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
  formatter: (value: number) => value.toLocaleString(),
};

export default class RangeSliderPipsView implements RangeSliderPipsView {
  readonly dom: { self: HTMLElement };

  private _options: Required<PipsOptions>;

  constructor(container: HTMLElement, options: PipsOptions = DEFAULT_OPTIONS) {
    this.dom = { self: container };

    this._options = defaultsDeep({}, options, DEFAULT_OPTIONS);

    this._fixOptions();
  }

  getOptions() {
    return {
      mode: this.getModeOption(),
      amount: this.getAmountOption(),
      density: this.getDensityOption(),
      formatter: this.getFormatterOption(),
    } as Required<PipsOptions>;
  }
  getModeOption() {
    return this._options.mode;
  }
  getAmountOption() {
    return this._options.amount;
  }
  getDensityOption() {
    return this._options.density;
  }
  getFormatterOption() {
    return this._options.formatter;
  }

  setOptions(options?: PipsOptions) {
    if (options === undefined) {
      this.setModeOption().setAmountOption().setDensityOption().setFormatterOption();
    } else {
      this._options = defaultsDeep({}, options, this._options);
      this._fixOptions();
    }

    return this;
  }
  setModeOption(mode: PipsOptions["mode"] = DEFAULT_OPTIONS.mode) {
    this._options.mode = mode;

    return this;
  }
  setAmountOption(amount: PipsOptions["amount"] = DEFAULT_OPTIONS.amount) {
    this._options.amount = amount;
    this._fixAmountOption();

    return this;
  }
  setDensityOption(density: PipsOptions["density"] = DEFAULT_OPTIONS.density) {
    this._options.density = density;
    this._fixDensityOption();

    return this;
  }
  setFormatterOption(formatter: PipsOptions["formatter"] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    return this;
  }

  private _fixOptions() {
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
    this._options.amount = collapsingParseInt(`${this._options.amount}`);
  }
  private _fixDensityOption() {
    this._options.density =
      this._options.density < DEFAULT_OPTIONS["density"] || getPrecision(this._options.density) > 0
        ? DEFAULT_OPTIONS["density"]
        : this._options.density;
    this._options.density = collapsingParseInt(`${this._options.density}`);
  }
}

type Mode = "range" | "count";
type Formatter = (value: number) => string;
