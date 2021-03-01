import template from "./range-slider__tooltip.view.pug";
import "./range-slider__tooltip.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import defaultsDeep from "lodash-es/defaultsDeep";

export default interface RangeSliderTooltipView extends MVPView<TooltipOptions> {
  getFormatterOption(): TooltipOptions["formatter"];
  setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
  getFormatterOption(): TooltipOptions["isHidden"];
  setFormatterOption(isHidden?: TooltipOptions["isHidden"]): this;
}

export type TooltipOptions = { formatter?: Formatter; isHidden?: boolean };

export const DEFAULT_OPTIONS: Required<TooltipOptions> = {
  formatter: {
    to: (value: number) => value.toLocaleString(),
    from: (value: string) => +parseFloat(value.replace(/[^0-9-.]/g, "")).toFixed(2),
  },
  isHidden: false,
};

export default class RangeSliderTooltipView {
  readonly dom: { self: HTMLElement };

  private _options: Required<TooltipOptions>;

  constructor(container: HTMLElement, options: TooltipOptions = DEFAULT_OPTIONS) {
    this.dom = { self: container };
    this._options = defaultsDeep(options, DEFAULT_OPTIONS);
  }
}

type Formatter = { to: (value: number) => string; from: (value: string) => number };
