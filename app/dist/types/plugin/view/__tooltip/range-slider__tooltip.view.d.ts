import { MVPView } from "../../../utils/devTools/scripts/PluginCreationHelper";
import IRangeSliderTooltipView, { TooltipOptions, TooltipState } from './range-slider__tooltip.view.coupling';
import './range-slider__tooltip.scss';
declare const DEFAULT_OPTIONS: Required<TooltipOptions>;
declare const DEFAULT_STATE: TooltipState;
declare class RangeSliderTooltipView extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState> implements IRangeSliderTooltipView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => import("lit-html").TemplateResult;
    constructor(options?: TooltipOptions, state?: TooltipState);
    getOrientationOption(): "left" | "top";
    getIsHiddenOption(): boolean;
    getFormatterOption(): import("./range-slider__tooltip.view.coupling").Formatter;
    setOrientationOption(orientation?: TooltipOptions['orientation']): this;
    setIsHiddenOption(isHidden?: TooltipOptions['isHidden']): this;
    setFormatterOption(formatter?: TooltipOptions['formatter']): this;
}
export { RangeSliderTooltipView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
