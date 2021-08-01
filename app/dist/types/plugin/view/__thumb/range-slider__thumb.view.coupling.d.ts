import { MVPView } from "../../../utils/devTools/scripts/PluginCreationHelper";
declare type ThumbOptions = {};
declare type ThumbState = {
    ariaOrientation: 'horizontal' | 'vertical';
    ariaValueMin: number;
    ariaValueMax: number;
    ariaValueNow: number;
    ariaValueText: string;
};
interface IRangeSliderThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {
}
export { IRangeSliderThumbView as default, ThumbOptions, ThumbState };
