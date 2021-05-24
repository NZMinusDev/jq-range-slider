import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
export declare type ThumbOptions = {};
export declare type ThumbState = {
    ariaOrientation: 'horizontal' | 'vertical';
    ariaValueMin: number;
    ariaValueMax: number;
    ariaValueNow: number;
    ariaValueText: string;
};
export default interface RangeSliderThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {
}
