import { MVPModel } from "@utils/devTools/tools/PluginCreationHelper";

export interface RangeSliderModel extends MVPModel<RangeSliderState> {}

export type RangeSliderState = {
  value: number[];
};
