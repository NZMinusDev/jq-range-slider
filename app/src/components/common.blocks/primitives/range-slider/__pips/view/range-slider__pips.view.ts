import template from "./range-slider__pips.view.pug";
import "./range-slider__pips.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import { getPrecision, collapsingParseInt } from "@utils/devTools/tools/ParserHelper";

export default interface RangeSliderPipsView {
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
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};

export default class RangeSliderPipsView
  extends MVPView<Required<PipsOptions>, PipsOptions>
  implements RangeSliderPipsView {
  constructor(container: HTMLElement, options: PipsOptions = DEFAULT_OPTIONS) {
    super(container, DEFAULT_OPTIONS, options);
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

  protected _fixAmountOption() {
    this._options.amount =
      this._options.amount < DEFAULT_OPTIONS["amount"] || getPrecision(this._options.amount) > 0
        ? DEFAULT_OPTIONS["amount"]
        : this._options.amount;
    this._options.amount = collapsingParseInt(`${this._options.amount}`);

    return this;
  }
  protected _fixDensityOption() {
    this._options.density =
      this._options.density < DEFAULT_OPTIONS["density"] || getPrecision(this._options.density) > 0
        ? DEFAULT_OPTIONS["density"]
        : this._options.density;
    this._options.density = collapsingParseInt(`${this._options.density}`);

    return this;
  }
}

type Mode = "range" | "count";
type Formatter = (value: number) => string;
