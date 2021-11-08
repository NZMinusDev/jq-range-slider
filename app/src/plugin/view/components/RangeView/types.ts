import { MVPView } from '@shared/utils/scripts/view/MVPHelper';

type RangeOptions = {
  isConnected?: boolean;
};

type RangeState = {};

interface RangeView
  extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
  getIsConnectedOption(): RangeOptions['isConnected'];
  setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}

export { RangeView as default, RangeOptions, RangeState };
