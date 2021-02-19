import template from "./range-slider__tooltip.view.pug";
import "./range-slider__tooltip.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTooltipView extends MVPView<TooltipOptions> {
  getFormatterOption(): TooltipOptions["formatter"];
  setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
  getFormatterOption(): TooltipOptions["isHidden"];
  setFormatterOption(isHidden?: TooltipOptions["isHidden"]): this;
}

export default class RangeSliderTooltipView {
  constructor(
    private container: HTMLElement,
    private _options: TooltipOptions = {
      formatter: {
        to: (value: number) => value.toString(),
        from: (value: string) => +parseFloat(value).toFixed(2),
      },
      isHidden: true,
    }
  ) {}
}

export type TooltipOptions = { formatter?: Formatter; isHidden?: boolean };

type Formatter = { to: (value: number) => string; from: (value: string) => number };
