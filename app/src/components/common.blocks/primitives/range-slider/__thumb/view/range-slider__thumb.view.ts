import "./range-slider__thumb.scss";

import { html, TemplateResult } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { spread } from "@open-wc/lit-helpers";

import { MVPView, template } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderThumbView {}

export type ThumbOptions = {};
export type ThumbState = {
  ariaOrientation: "horizontal" | "vertical";
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};

export const DEFAULT_OPTIONS: Required<ThumbOptions> = {};
export const DEFAULT_STATE: ThumbState = {
  ariaOrientation: "horizontal",
  ariaValueMin: -1,
  ariaValueMax: -1,
  ariaValueNow: -1,
  ariaValueText: "-1",
};

const ARIA_ATTRIBUTE_PRECISION = 2;

export default class RangeSliderThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState>
  implements RangeSliderThumbView {
  readonly template: template = (
    { classInfo = {}, styleInfo = {}, attributes = {} } = {},
    innerHTML: TemplateResult | TemplateResult[] = html``
  ) =>
    html`<div
      class=${classMap({ "range-slider__thumb-origin": true, ...classInfo })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    >
      <div
        class=${classMap({ "range-slider__thumb": true })}
        role="slider"
        tabindex="0"
        aria-orientation="${this._state.ariaOrientation}"
        aria-valuemin="${+this._state.ariaValueMin.toFixed(ARIA_ATTRIBUTE_PRECISION)}"
        aria-valuemax="${+this._state.ariaValueMax.toFixed(ARIA_ATTRIBUTE_PRECISION)}"
        aria-valuenow="${+this._state.ariaValueNow.toFixed(ARIA_ATTRIBUTE_PRECISION)}"
        aria-valuetext="${this._state.ariaValueText}"
        @dragstart=${this}
      ></div>
      ${innerHTML}
    </div>`;

  constructor(options: ThumbOptions = DEFAULT_OPTIONS, state: ThumbState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {});
  }

  protected _onDragstart() {
    return false;
  }
}
