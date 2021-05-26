import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
declare type RangeOptions = {
    isConnected?: boolean;
};
declare type RangeState = {};
interface RangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
    getIsConnectedOption(): RangeOptions['isConnected'];
    setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}
export { RangeSliderRangeView as default, RangeOptions, RangeState };
