import { TemplateResult } from 'lit-html';
import { MVPView } from "../../../../utils/devTools/scripts/PluginCreationHelper";
import IThumbView, { ThumbOptions, ThumbState } from './IThumbView';
import './ThumbView.scss';
declare const DEFAULT_OPTIONS: Required<ThumbOptions>;
declare const DEFAULT_STATE: ThumbState;
declare class ThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> implements IThumbView {
    protected static ariaAttributePrecision: number;
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
export { ThumbView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
