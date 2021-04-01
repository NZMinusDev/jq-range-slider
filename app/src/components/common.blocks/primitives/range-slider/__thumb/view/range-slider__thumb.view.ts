import "./range-slider__thumb.scss";

import { html, render, TemplateResult } from "lit-html";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderThumbView {
  getId(): Id;
  getStartOption(): ThumbOptions["start"];
  setStartOption(start?: ThumbOptions["start"]): this;
}

export type ThumbOptions = { start?: number };
export type ThumbState = {};

export const DEFAULT_OPTIONS: Required<ThumbOptions> = {
  start: 0,
};
export const DEFAULT_STATE: ThumbState = {};

export default class RangeSliderThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState>
  implements RangeSliderThumbView {
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

  protected _render(container?: HTMLElement | DocumentFragment) {
    const template = (innerHTML: TemplateResult | TemplateResult[]) =>
      html`<div class="range-slider__thumb" @pointerdown=${this} @pointerup=${this}>
        ${innerHTML}
      </div>`;

    render(template, (this.dom.container = container ?? this.dom.container));

    return template;
  }
  protected _onPointerdown(event: PointerEvent) {
    console.log("_onPointerdown");
  }
  protected _onPointerup(event: PointerEvent) {
    console.log("_onPointerup");
  }
}

export type Id = number;
