import "./range-slider__tooltip.scss";

import { html, render } from "lit-html";
import { ClassInfo, classMap } from "lit-html/directives/class-map";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTooltipView {
  getIsHiddenOption(): TooltipOptions["isHidden"];
  getFormatterOption(): TooltipOptions["formatter"];
  setIsHiddenOption(isHidden?: TooltipOptions["isHidden"]): this;
  setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
}

export type TooltipOptions = { isHidden?: boolean; formatter?: Formatter };
export type TooltipState = {
  value: number;
  translate: [x: number, y: number];
};

export const DEFAULT_OPTIONS: Required<TooltipOptions> = {
  isHidden: false,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};
export const DEFAULT_STATE: TooltipState = {
  value: 0,
  translate: [0, 0],
};

export default class RangeSliderTooltipView
  extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState>
  implements RangeSliderTooltipView {
  constructor(options: TooltipOptions = DEFAULT_OPTIONS, state: TooltipState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ["isHidden", "formatter"],
      theOrderOfIteratingThroughTheState: ["value", "translate"],
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
  setTranslateState(translate: TooltipState["translate"] = DEFAULT_STATE.translate) {
    this._state.translate = ([] as number[]).concat(translate) as TooltipState["translate"];

    return this;
  }

  protected _render(container?: HTMLElement | DocumentFragment) {
    const classes: ClassInfo = {
      "range-slider__tooltip": true,
      "range-slider__tooltip_isHidden": this._options.isHidden,
    };

    const template = () => html`<div
      class=${classMap(classes)}
      style="transform:translate(${this._state.translate[0]}px,${this._state.translate[1]}px)"
    >
      ${this._state.value}
    </div>`;

    render(template, (this.dom.container = container ?? this.dom.container));

    return template;
  }
}

type Formatter = (value: number) => string;
