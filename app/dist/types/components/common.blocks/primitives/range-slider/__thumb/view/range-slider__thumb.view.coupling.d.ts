import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
declare type ThumbOptions = {};
declare type ThumbState = {
    ariaOrientation: 'horizontal' | 'vertical';
    ariaValueMin: number;
    ariaValueMax: number;
    ariaValueNow: number;
    ariaValueText: string;
};
interface RangeSliderThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {
}
export { RangeSliderThumbView as default, ThumbOptions, ThumbState };
