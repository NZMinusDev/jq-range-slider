import './range-slider__range.scss';
import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
import IRangeSliderRangeView, { RangeOptions, RangeState } from './range-slider__range.view.coupling';
export declare const DEFAULT_OPTIONS: Required<RangeOptions>;
export declare const DEFAULT_STATE: RangeState;
export default class RangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> implements IRangeSliderRangeView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => import("lit-html").TemplateResult;
    constructor(options?: RangeOptions, state?: RangeState);
    getIsConnectedOption(): boolean;
    setIsConnectedOption(isConnected?: boolean): this;
}
