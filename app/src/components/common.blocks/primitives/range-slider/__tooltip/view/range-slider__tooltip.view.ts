import "./range-slider__tooltip.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTooltipView {
  getIsHiddenOption(): TooltipOptions["isHidden"];
  getFormatterOption(): TooltipOptions["formatter"];
  setIsHiddenOption(isHidden?: TooltipOptions["isHidden"]): this;
  setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
}

export type TooltipOptions = { isHidden?: boolean; formatter?: Formatter };

export const DEFAULT_OPTIONS: Required<TooltipOptions> = {
  isHidden: false,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};

export default class RangeSliderTooltipView
  extends MVPView<Required<TooltipOptions>, TooltipOptions>
  implements RangeSliderTooltipView {
  constructor(container: HTMLElement, options: TooltipOptions = DEFAULT_OPTIONS) {
    super(container, DEFAULT_OPTIONS, options, ["isHidden", "formatter"]);
  }

  getIsHiddenOption() {
    return this._options.isHidden;
  }
  getFormatterOption() {
    return this._options.formatter;
  }

  setIsHiddenOption(isHidden: TooltipOptions["isHidden"] = DEFAULT_OPTIONS.isHidden) {
    this._options.isHidden = isHidden;

    return this;
  }
  setFormatterOption(formatter: TooltipOptions["formatter"] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    return this;
  }
}

type Formatter = (value: number) => string;
