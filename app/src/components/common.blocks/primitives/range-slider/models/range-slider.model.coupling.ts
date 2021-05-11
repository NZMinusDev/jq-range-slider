import type { MVPModel } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderModel extends MVPModel<RangeSliderState> {}

export type RangeSliderState = {
  value: number[];
};
