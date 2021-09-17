import { MVPView } from "../../../../utils/devTools/scripts/PluginCreationHelper";
declare type RangeOptions = {
    isConnected?: boolean;
};
declare type RangeState = {};
interface IRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> {
    getIsConnectedOption(): RangeOptions['isConnected'];
    setIsConnectedOption(connect?: RangeOptions['isConnected']): this;
}
export { IRangeView as default, RangeOptions, RangeState };
