import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
export declare type RangeOptions = {
    isConnected?: boolean;
};
export declare type RangeState = {};
export default interface RangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
    getIsConnectedOption(): RangeOptions['isConnected'];
    setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}
