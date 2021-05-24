import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

export type RangeOptions = {
  isConnected?: boolean;
};

export type RangeState = {
  // state
};

export default interface RangeSliderRangeView
  extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
  getIsConnectedOption(): RangeOptions['isConnected'];
  setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}
