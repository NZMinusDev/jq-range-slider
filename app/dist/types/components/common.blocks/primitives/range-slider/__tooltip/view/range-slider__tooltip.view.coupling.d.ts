import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
export default interface RangeSliderTooltipView extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState> {
    getOrientationOption(): TooltipOptions["orientation"];
    getIsHiddenOption(): TooltipOptions["isHidden"];
    getFormatterOption(): TooltipOptions["formatter"];
    setOrientationOption(orientation: TooltipOptions["orientation"]): this;
    setIsHiddenOption(isHidden?: TooltipOptions["isHidden"]): this;
    setFormatterOption(formatter?: TooltipOptions["formatter"]): this;
}
export declare type TooltipOptions = {
    orientation?: "top" | "left";
    isHidden?: boolean;
    formatter?: Formatter;
};
export declare type TooltipState = {
    value: number;
};
export declare type Formatter = (value: number) => string;
