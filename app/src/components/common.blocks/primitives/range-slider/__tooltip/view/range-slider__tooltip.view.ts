import template from "./range-slider__tooltip.view.pug";
import "./range-slider__tooltip.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTooltipView extends MVPView<TooltipOptions> {
  getFormatterOption(): TooltipOptions["formatter"];
  setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
  hide(): this;
  show(): this;
}

export default class RangeSliderTooltipView {}

export type TooltipOptions = { formatter: Formatter; isHidden: boolean };

type Formatter = { to: (value: number) => string; from: (value: string) => number };
