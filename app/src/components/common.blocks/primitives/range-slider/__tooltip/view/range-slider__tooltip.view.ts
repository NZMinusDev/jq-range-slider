import "./range-slider__tooltip.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTooltipView {
  getFormatterOption(): TooltipOptions["formatter"];
  getIsHiddenOption(): TooltipOptions["isHidden"];
  setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
  setIsHiddenOption(isHidden?: TooltipOptions["isHidden"]): this;
}

export type TooltipOptions = { formatter?: Formatter; isHidden?: boolean };

export const DEFAULT_OPTIONS: Required<TooltipOptions> = {
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
  isHidden: false,
};

export default class RangeSliderTooltipView
  extends MVPView<Required<TooltipOptions>, TooltipOptions>
  implements RangeSliderTooltipView {
  constructor(container: HTMLElement, options: TooltipOptions = DEFAULT_OPTIONS) {
    super(container, DEFAULT_OPTIONS, options);
  }

  getFormatterOption() {
    return this._options.formatter;
  }
  getIsHiddenOption() {
    return this._options.isHidden;
  }

  setFormatterOption(formatter: TooltipOptions["formatter"] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    return this;
  }
  setIsHiddenOption(isHidden: TooltipOptions["isHidden"] = DEFAULT_OPTIONS.isHidden) {
    this._options.isHidden = isHidden;

    return this;
  }
}

type Formatter = (value: number) => string;
