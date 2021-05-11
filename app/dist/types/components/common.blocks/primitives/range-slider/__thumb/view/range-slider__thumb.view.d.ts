import "./range-slider__thumb.scss";
import IRangeSliderThumbView, { ThumbOptions, ThumbState } from "./range-slider__thumb.view.coupling";
import { TemplateResult } from "lit-html";
import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
export declare const DEFAULT_OPTIONS: Required<ThumbOptions>;
export declare const DEFAULT_STATE: ThumbState;
export default class RangeSliderThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> implements IRangeSliderThumbView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }, innerHTML?: TemplateResult | TemplateResult[], isActive?: boolean) => TemplateResult;
    constructor(options?: ThumbOptions, state?: ThumbState);
    protected _onDragstart(): boolean;
}
