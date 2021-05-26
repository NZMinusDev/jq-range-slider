import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

type RangeOptions = {
  isConnected?: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type RangeState = {};

interface RangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
  getIsConnectedOption(): RangeOptions['isConnected'];
  setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}

export { RangeSliderRangeView as default, RangeOptions, RangeState };
