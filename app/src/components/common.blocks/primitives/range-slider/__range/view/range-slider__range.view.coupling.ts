import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

export type RangeOptions = {
  isConnected?: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type RangeState = {};

export default interface RangeSliderRangeView
  extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
  getIsConnectedOption(): RangeOptions['isConnected'];
  setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}
