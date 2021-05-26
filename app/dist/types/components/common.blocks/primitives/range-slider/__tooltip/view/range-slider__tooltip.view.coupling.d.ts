import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
declare type Formatter = (value: number) => string;
declare type TooltipOptions = {
    orientation?: 'top' | 'left';
    isHidden?: boolean;
    formatter?: Formatter;
};
declare type TooltipState = {
    value: number;
};
interface RangeSliderTooltipView extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState> {
    getOrientationOption(): TooltipOptions['orientation'];
    getIsHiddenOption(): TooltipOptions['isHidden'];
    getFormatterOption(): TooltipOptions['formatter'];
    setOrientationOption(orientation: TooltipOptions['orientation']): this;
    setIsHiddenOption(isHidden?: TooltipOptions['isHidden']): this;
    setFormatterOption(formatter?: TooltipOptions['formatter']): this;
}
export { RangeSliderTooltipView as default, Formatter, TooltipOptions, TooltipState };
