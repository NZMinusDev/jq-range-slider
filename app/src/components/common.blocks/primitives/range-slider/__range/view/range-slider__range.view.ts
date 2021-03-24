import "./range-slider__range.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderRangeView {
  getIsConnectedOption(): RangeOptions["isConnected"];
  setIsConnectedOption(connect?: RangeOptions["isConnected"]): this;
}

export type RangeOptions = {
  isConnected?: boolean;
};

export const DEFAULT_OPTIONS: Required<RangeOptions> = {
  isConnected: false,
};

export default class RangeSliderRangeView
  extends MVPView<Required<RangeOptions>, RangeOptions>
  implements RangeSliderRangeView {
  constructor(container: HTMLElement, options: RangeOptions = DEFAULT_OPTIONS) {
    super(container, DEFAULT_OPTIONS, options, ["isConnected"]);
  }

  getIsConnectedOption() {
    return this._options.isConnected;
  }

  setIsConnectedOption(isConnected = DEFAULT_OPTIONS.isConnected) {
    this._options.isConnected = isConnected;

    return this;
  }
}
