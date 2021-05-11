import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {}

export type ThumbOptions = {};

export type ThumbState = {
  ariaOrientation: "horizontal" | "vertical";
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};
