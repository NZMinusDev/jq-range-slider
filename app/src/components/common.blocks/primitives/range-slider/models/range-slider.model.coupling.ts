import type { MVPModel } from '@utils/devTools/tools/PluginCreationHelper';

type RangeSliderState = {
  value: number[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RangeSliderModel extends MVPModel<RangeSliderState> {}

export { RangeSliderModel as default, RangeSliderState };
