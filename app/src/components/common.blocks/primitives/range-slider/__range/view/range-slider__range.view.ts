import template from "./range-slider__range.view.pug";
import "./range-slider__range.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderRangeView extends MVPView<RangeOptions> {
  getConnectOption(): RangeOptions["isConnected"];
  setConnectOption(connect?: RangeOptions["isConnected"]): this;
}

export default class RangeSliderRangeView {
  constructor(
    private container: HTMLElement,
    private _options: RangeOptions = {
      isConnected: false,
    }
  ) {}
}

export type RangeOptions = {
  isConnected?: boolean;
};
