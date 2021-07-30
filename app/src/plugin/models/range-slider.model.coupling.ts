import type { MVPModel } from '@utils/devTools/scripts/PluginCreationHelper';

type RangeSliderState = {
  value: number[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRangeSliderModel extends MVPModel<RangeSliderState> {}

export { IRangeSliderModel as default, RangeSliderState };
