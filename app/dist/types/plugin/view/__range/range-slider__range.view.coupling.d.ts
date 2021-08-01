import { MVPView } from "../../../utils/devTools/scripts/PluginCreationHelper";
declare type RangeOptions = {
    isConnected?: boolean;
};
declare type RangeState = {};
interface IRangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
    getIsConnectedOption(): RangeOptions['isConnected'];
    setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}
export { IRangeSliderRangeView as default, RangeOptions, RangeState };
