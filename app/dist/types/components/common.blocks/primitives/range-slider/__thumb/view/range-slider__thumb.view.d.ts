import { TemplateResult } from 'lit-html';
import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
import './range-slider__thumb.scss';
import IRangeSliderThumbView, { ThumbOptions, ThumbState } from './range-slider__thumb.view.coupling';
declare const DEFAULT_OPTIONS: Required<ThumbOptions>;
declare const DEFAULT_STATE: ThumbState;
declare class RangeSliderThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> implements IRangeSliderThumbView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }, { innerHTML, isActive }?: {
        innerHTML: TemplateResult | TemplateResult[];
        isActive: boolean;
    }) => TemplateResult;
    constructor(options?: ThumbOptions, state?: ThumbState);
    protected _onDragstart(): boolean;
}
export { RangeSliderThumbView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
