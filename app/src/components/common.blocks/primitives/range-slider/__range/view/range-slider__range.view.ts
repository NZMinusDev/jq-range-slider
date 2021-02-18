import template from "./range-slider__range.view.pug";
import "./range-slider__range.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderRangeView extends MVPView<RangeOptions> {
  getStartOption(): RangeOptions["start"];
  getRangeOption(): RangeOptions["range"];
  getConnectOption(): RangeOptions["isConnected"];
  setStartOption(start?: RangeOptions["start"]): this;
  setRangeOption(range?: Partial<RangeOptions["range"]>): this;
  setConnectOption(connect?: RangeOptions["isConnected"]): this;
}

export default class RangeSliderRangeView {}

export type RangeOptions = {
  start: number;
  range: {
    min: number;
    max: number;
    [key: string]: number;
  };
  isConnected: boolean;
};
