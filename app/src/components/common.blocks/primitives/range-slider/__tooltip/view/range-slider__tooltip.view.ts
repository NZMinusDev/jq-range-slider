import "./range-slider__tooltip.scss";

import { html } from "lit-html";
import { ClassInfo, classMap } from "lit-html/directives/class-map";
import { StyleInfo, styleMap } from "lit-html/directives/style-map";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTooltipView {
  getIsHiddenOption(): TooltipOptions["isHidden"];
  getFormatterOption(): TooltipOptions["formatter"];
  setIsHiddenOption(isHidden?: TooltipOptions["isHidden"]): this;
  setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
}

export type TooltipOptions = { isHidden?: boolean; formatter?: Formatter };
export type TooltipState = {
  value: number | string;
};

export const DEFAULT_OPTIONS: Required<TooltipOptions> = {
  isHidden: false,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};
export const DEFAULT_STATE: TooltipState = {
  value: 0,
};

export default class RangeSliderTooltipView
  extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState>
  implements RangeSliderTooltipView {
  readonly template = (classInfo: ClassInfo, styleInfo: StyleInfo) => html`<div
    class=${classMap(
      Object.assign(
        {},
        {
          "range-slider__tooltip": true,
          "range-slider__tooltip_isHidden": this._options.isHidden,
        },
        classInfo
      )
    )}
    style=${styleMap(Object.assign({}, {}, styleInfo))}
  >
    ${this._state.value}
  </div>`;

  constructor(options: TooltipOptions = DEFAULT_OPTIONS, state: TooltipState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ["isHidden", "formatter"],
      theOrderOfIteratingThroughTheState: ["value"],
    });
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

  setValueState(value: TooltipState["value"] = DEFAULT_STATE.value) {
    this._state.value = value;

    return this;
  }
}

type Formatter = (value: number) => string;
