import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
import './range-slider__pips.scss';
import IRangeSliderPipsView, { PipsOptions, PipsState } from './range-slider__pips.view.coupling';
declare const DEFAULT_OPTIONS: Required<PipsOptions>;
declare const DEFAULT_STATE: PipsState;
declare class RangeSliderPipsView extends MVPView<Required<PipsOptions>, PipsOptions, PipsState> implements IRangeSliderPipsView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => import("lit-html").TemplateResult;
    constructor(options?: PipsOptions, state?: PipsState);
    getOrientationOption(): "horizontal" | "vertical";
    getIsHiddenOption(): boolean;
    getValuesOption(): {
        percent: number;
        value: number;
    }[];
    getDensityOption(): number;
    getFormatterOption(): import("./range-slider__pips.view.coupling").Formatter;
    setOrientationOption(orientation?: PipsOptions['orientation']): this;
    setIsHiddenOption(isHidden?: PipsOptions['isHidden']): this;
    setValuesOption(values?: PipsOptions['values']): this;
    setDensityOption(density?: PipsOptions['density']): this;
    setFormatterOption(formatter?: PipsOptions['formatter']): this;
    protected _fixValuesOption(): this;
    protected _fixDensityOption(): this;
    protected _getPipsRender(): import("lit-html").TemplateResult | import("lit-html").TemplateResult[];
    protected _getMarkersRender(end: number, range: number, positionKey: 'left' | 'top'): import("lit-html").TemplateResult[];
}
export { RangeSliderPipsView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
