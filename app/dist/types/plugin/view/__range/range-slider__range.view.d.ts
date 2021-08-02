import { MVPView } from "../../../utils/devTools/scripts/PluginCreationHelper";
import IRangeSliderRangeView, { RangeOptions, RangeState } from './range-slider__range.view.coupling';
import './range-slider__range.scss';
declare const DEFAULT_OPTIONS: Required<RangeOptions>;
declare const DEFAULT_STATE: RangeState;
declare class RangeSliderRangeView extends MVPView<Required<RangeOptions>, RangeOptions, RangeState> implements IRangeSliderRangeView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => import("lit-html").TemplateResult;
    constructor(options?: RangeOptions, state?: RangeState);
    getIsConnectedOption(): boolean;
    setIsConnectedOption(isConnected?: boolean): this;
}
export { RangeSliderRangeView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
