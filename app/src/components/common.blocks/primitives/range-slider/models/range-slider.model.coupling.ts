import type { MVPModel } from '@utils/devTools/tools/PluginCreationHelper';

export type RangeSliderState = {
  value: number[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface RangeSliderModel extends MVPModel<RangeSliderState> {}
