import "./range-slider__range.scss";

import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { spread } from "@open-wc/lit-helpers";

import { MVPView, template } from "@utils/devTools/tools/PluginCreationHelper";

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
  readonly template: template = ({ classInfo={}, styleInfo={}, attributes={} }) =>
    html`<div
      class=${classMap(
        Object.assign(
          {},
          {
            "range-slider__range": true,
            ".range-slider__range_isConnected": this._options.isConnected,
          },
          classInfo
        )
      )}
      ...=${spread(attributes)}
      style=${styleMap(Object.assign({}, {}, styleInfo))}
    ></div>`;

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
}
