import template from "./range-slider__pips.view.pug";
import "./range-slider__pips.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

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

export default class RangeSliderPipsView {}

export type PipsOptions = {
  mode: Mode;
  amount: number;
  density: number;
  formatter: Formatter;
};

type Mode = "range" | "count";
type Formatter = { to: (value: number) => string; from: (value: string) => number };
