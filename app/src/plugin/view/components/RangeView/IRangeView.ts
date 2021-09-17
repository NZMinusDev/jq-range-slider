import { MVPView } from '@utils/devTools/scripts/PluginCreationHelper';

type RangeOptions = {
  isConnected?: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type RangeState = {};

interface IRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
  getIsConnectedOption(): RangeOptions['isConnected'];
  setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}

export { IRangeView as default, RangeOptions, RangeState };
