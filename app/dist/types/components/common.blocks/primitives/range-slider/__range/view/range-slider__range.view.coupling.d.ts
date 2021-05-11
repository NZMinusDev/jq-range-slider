import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
export default interface RangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
    getIsConnectedOption(): RangeOptions["isConnected"];
    setIsConnectedOption(connect?: RangeOptions["isConnected"]): this;
}
export declare type RangeOptions = {
    isConnected?: boolean;
};
export declare type RangeState = {};
