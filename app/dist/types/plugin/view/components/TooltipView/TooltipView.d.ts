import { MVPView } from "../../../../utils/devTools/scripts/PluginCreationHelper";
import ITooltipView, { TooltipOptions, TooltipState } from './ITooltipView';
import './TooltipView.scss';
declare const DEFAULT_OPTIONS: Required<TooltipOptions>;
declare const DEFAULT_STATE: TooltipState;
declare class TooltipView extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState> implements ITooltipView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => import("lit-html").TemplateResult;
    constructor(options?: TooltipOptions, state?: TooltipState);
    getOrientationOption(): "left" | "top";
    getIsHiddenOption(): boolean;
    getFormatterOption(): import("./ITooltipView").Formatter;
    setOrientationOption(orientation?: TooltipOptions['orientation']): this;
    setIsHiddenOption(isHidden?: TooltipOptions['isHidden']): this;
    setFormatterOption(formatter?: TooltipOptions['formatter']): this;
}
export { TooltipView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
