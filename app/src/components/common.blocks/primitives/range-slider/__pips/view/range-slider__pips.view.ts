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

export default class RangeSliderPipsView {
  constructor(
    private container: HTMLElement,
    private _options: PipsOptions = {
      mode: "range",
      amount: 2,
      density: 3,
      formatter: {
        to: (value: number) => value.toString(),
        from: (value: string) => +parseFloat(value).toFixed(2),
      },
    }
  ) {}
}

export type PipsOptions = {
  mode?: Mode;
  amount?: number;
  density?: number;
  formatter?: Formatter;
};

type Mode = "range" | "count";
type Formatter = { to: (value: number) => string; from: (value: string) => number };
