import './range-slider__pips.scss';
import { TemplateResult } from 'lit-html';
import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
import IRangeSliderPipsView, { PipsOptions, PipsState } from './range-slider__pips.view.coupling';
export declare const DEFAULT_OPTIONS: Required<PipsOptions>;
export declare const DEFAULT_STATE: PipsState;
export default class RangeSliderPipsView extends MVPView<Required<PipsOptions>, PipsOptions, PipsState> implements IRangeSliderPipsView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => TemplateResult;
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
    protected _getPipsRender(): TemplateResult | TemplateResult[];
}
