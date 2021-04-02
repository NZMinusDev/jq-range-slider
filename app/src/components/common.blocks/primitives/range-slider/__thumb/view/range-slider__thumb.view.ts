import "./range-slider__thumb.scss";

import { html, TemplateResult } from "lit-html";
import { ClassInfo, classMap } from "lit-html/directives/class-map";
import { StyleInfo, styleMap } from "lit-html/directives/style-map";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

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

export default class RangeSliderThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState, "pointerdown">
  implements RangeSliderThumbView {
  readonly template = (
    classInfo: ClassInfo,
    styleInfo: StyleInfo,
    innerHTML: TemplateResult | TemplateResult[]
  ) =>
    html`<div
      class=${classMap(Object.assign({}, { "range-slider__thumb": true }, classInfo))}
      role="slider"
      tabindex="0"
      aria-orientation="${this._state.ariaOrientation}"
      aria-valuemin="${this._state.ariaValueMin}"
      aria-valuemax="${this._state.ariaValueMax}"
      aria-valuenow="${this._state.ariaValueNow}"
      aria-valuetext="${this._state.ariaValueText}"
      style=${styleMap(Object.assign({}, {}, styleInfo))}
      @dragstart=${() => false}
      @pointerdown=${this}
    >
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

  getAriaOrientationState() {
    return this._state.ariaOrientation;
  }
  getAriaValueMinState() {
    return this._state.ariaValueMin;
  }
  getAriaValueMaxState() {
    return this._state.ariaValueMax;
  }
  getAriaValueNowState() {
    return this._state.ariaValueNow;
  }
  getAriaValueTextState() {
    return this._state.ariaValueText;
  }

  setStartOption(start: ThumbOptions["start"] = DEFAULT_OPTIONS.start) {
    this._options.start = start;
    this._fixStartOption();

    return this;
  }

  setAriaOrientationState(
    ariaOrientation: ThumbState["ariaOrientation"] = DEFAULT_STATE["ariaOrientation"]
  ) {
    this._state.ariaOrientation = ariaOrientation;

    return this;
  }
  setAriaValueMinState(ariaValueMin: ThumbState["ariaValueMin"] = DEFAULT_STATE["ariaValueMin"]) {
    this._state.ariaValueMin = ariaValueMin;

    return this;
  }
  setAriaValueMaxState(ariaValueMax: ThumbState["ariaValueMax"] = DEFAULT_STATE["ariaValueMax"]) {
    this._state.ariaValueMax = ariaValueMax;

    return this;
  }
  setAriaValueNowState(ariaValueNow: ThumbState["ariaValueNow"] = DEFAULT_STATE["ariaValueNow"]) {
    this._state.ariaValueNow = ariaValueNow;

    return this;
  }
  setAriaValueTextState(
    ariaValueText: ThumbState["ariaValueText"] = DEFAULT_STATE["ariaValueText"]
  ) {
    this._state.ariaValueText = ariaValueText;

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

  protected _onPointerdown(event: PointerEvent) {
    this.trigger("pointerdown", { view: this, event: event });
  }
}

export type Id = number;
