import { MVPView } from '@utils/devTools/scripts/view/MVPHelper';

type RangeOptions = {
  isConnected?: boolean;
};

type RangeState = {};

interface IRangeView
  extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
  getIsConnectedOption(): RangeOptions['isConnected'];
  setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}

export { IRangeView as default, RangeOptions, RangeState };
