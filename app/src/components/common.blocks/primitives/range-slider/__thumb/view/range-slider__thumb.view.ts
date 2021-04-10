import "./range-slider__thumb.scss";

import { html, TemplateResult } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { spread } from "@open-wc/lit-helpers";

import { MVPView, template } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderThumbView {
  getId(): Id;
  getStartOption(): ThumbOptions["start"];
  setStartOption(start?: ThumbOptions["start"]): this;
}

export type ThumbOptions = { start?: number };
export type ThumbState = {
  ariaOrientation: "horizontal" | "vertical";
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};

export const DEFAULT_OPTIONS: Required<ThumbOptions> = {
  start: 0,
};
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

  protected _id: number;

  constructor(options: ThumbOptions = DEFAULT_OPTIONS, state: ThumbState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ["start"],
    });

    this._id = new Date().getTime();
  }

  getId() {
    return this._id;
  }

  getStartOption() {
    return this._options.start;
  }

  setStartOption(start: ThumbOptions["start"] = DEFAULT_OPTIONS.start) {
    this._options.start = start;
    this._fixStartOption();

    return this;
  }

  protected _fixStartOption() {
    this._options.start =
      this._options.start > Number.MAX_SAFE_INTEGER
        ? Number.MAX_SAFE_INTEGER
        : this._options.start < Number.MIN_SAFE_INTEGER
        ? Number.MIN_SAFE_INTEGER
        : this._options.start;

    return this;
  }

  protected _onDragstart() {
    return false;
  }
}

export type Id = number;
