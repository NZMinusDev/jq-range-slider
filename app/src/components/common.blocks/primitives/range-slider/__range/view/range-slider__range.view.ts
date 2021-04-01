import "./range-slider__range.scss";

import { html, render } from "lit-html";
import { ClassInfo, classMap } from "lit-html/directives/class-map";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderRangeView {
  getIsConnectedOption(): RangeOptions["isConnected"];
  setIsConnectedOption(connect?: RangeOptions["isConnected"]): this;
}

export type RangeOptions = {
  isConnected?: boolean;
};
export type RangeState = {};

export const DEFAULT_OPTIONS: Required<RangeOptions> = {
  isConnected: false,
};
export const DEFAULT_STATE: RangeState = {};

export default class RangeSliderRangeView
  extends MVPView<Required<RangeOptions>, RangeOptions, RangeState>
  implements RangeSliderRangeView {
  constructor(options: RangeOptions = DEFAULT_OPTIONS, state: RangeState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ["isConnected"],
    });
  }

  getIsConnectedOption() {
    return this._options.isConnected;
  }

  setIsConnectedOption(isConnected = DEFAULT_OPTIONS.isConnected) {
    this._options.isConnected = isConnected;

    return this;
  }

  protected _render(container?: HTMLElement | DocumentFragment) {
    const classes: ClassInfo = {
      "range-slider__range": true,
      ".range-slider__range_isConnected": this._options.isConnected,
    };

    const template = () => html`<div class=${classMap(classes)}></div>`;

    render(template, (this.dom.container = container ?? this.dom.container));

    return template;
  }
}
