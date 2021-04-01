import "./range-slider__thumb.scss";

import { html, TemplateResult } from "lit-html";

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
  readonly template = (innerHTML: TemplateResult | TemplateResult[]) =>
    html`<div class="range-slider__thumb" @pointerdown=${this} @pointerup=${this}>
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

  // protected _onPointerdown(event: PointerEvent) {
  //   this.trigger("pointerdown");
  //   console.log("_onPointerdown");
  // }
  // protected _onPointerup(event: PointerEvent) {
  //   this.trigger("pointerup");
  //   console.log("_onPointerup");
  // }
  // protected _onDocumentMouseMove(e: MouseEvent) {
  //   this._moveTo(e.clientX);
  // }
  // protected _onDocumentMouseUp() {
  //   this._endDrag();
  // }

  // protected _startDrag(startClientX:number, startClientY:number) {
  //   thumbCoords = thumbElem.getBoundingClientRect();
  //   shiftX = startClientX - thumbCoords.left;
  //   shiftY = startClientY - thumbCoords.top;

  //   sliderCoords = elem.getBoundingClientRect();

  //   document.addEventListener("mousemove", onDocumentMouseMove);
  //   document.addEventListener("mouseup", onDocumentMouseUp);
  // }
  // protected _moveTo(clientX:number) {
  //   // вычесть координату родителя, т.к. position: relative
  //   var newLeft = clientX - shiftX - sliderCoords.left;

  //   // курсор ушёл вне слайдера
  //   if (newLeft < 0) {
  //     newLeft = 0;
  //   }
  //   var rightEdge = elem.offsetWidth - thumbElem.offsetWidth;
  //   if (newLeft > rightEdge) {
  //     newLeft = rightEdge;
  //   }

  //   thumbElem.style.left = newLeft + "px";
  // }
  // protected _endDrag() {
  //   document.removeEventListener("mousemove", onDocumentMouseMove);
  //   document.removeEventListener("mouseup", onDocumentMouseUp);
  // }
}

export type Id = number;
