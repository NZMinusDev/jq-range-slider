import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

type RangeOptions = {
  isConnected?: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type RangeState = {};

interface IRangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
  getIsConnectedOption(): RangeOptions['isConnected'];
  setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}

export { IRangeSliderRangeView as default, RangeOptions, RangeState };
