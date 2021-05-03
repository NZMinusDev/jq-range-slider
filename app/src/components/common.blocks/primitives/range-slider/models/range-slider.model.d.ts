import { MVPModel } from "@utils/devTools/tools/PluginCreationHelper";

interface RangeSliderModel extends MVPModel<RangeSliderState> {}

type RangeSliderState = {
  value: number[];
};
