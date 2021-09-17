import { StyleInfo } from 'lit-html/directives/style-map';
import { MVPView } from "../../../../utils/devTools/scripts/PluginCreationHelper";
import IPipsView, { PipsOptions, PipsState } from './IPipsView';
import './PipsView.scss';
declare const DEFAULT_OPTIONS: Required<PipsOptions>;
declare const DEFAULT_STATE: PipsState;
declare class PipsView extends MVPView<Required<PipsOptions>, PipsOptions, PipsState> implements IPipsView {
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
    getFormatterOption(): import("./IPipsView").Formatter;
    setOrientationOption(orientation?: PipsOptions['orientation']): this;
    setIsHiddenOption(isHidden?: PipsOptions['isHidden']): this;
    setValuesOption(values?: PipsOptions['values']): this;
    setDensityOption(density?: PipsOptions['density']): this;
    setFormatterOption(formatter?: PipsOptions['formatter']): this;
    protected _fixValuesOption(): this;
    protected _fixDensityOption(): this;
    protected _getPipsRender(): import("lit-html").TemplateResult | import("lit-html").TemplateResult[];
    protected _getMarkersRender(end: number, range: number, positionKey: 'left' | 'top'): import("lit-html").TemplateResult[];
    protected _getValueRender(styleInfo: StyleInfo, value: number): import("lit-html").TemplateResult;
}
export { PipsView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
