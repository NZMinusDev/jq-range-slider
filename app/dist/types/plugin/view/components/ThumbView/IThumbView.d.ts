import { MVPView } from "../../../../utils/devTools/scripts/PluginCreationHelper";
declare type ThumbOptions = {};
declare type ThumbState = {
    ariaOrientation: 'horizontal' | 'vertical';
    ariaValueMin: number;
    ariaValueMax: number;
    ariaValueNow: number;
    ariaValueText: string;
};
interface IThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {
}
export { IThumbView as default, ThumbOptions, ThumbState };
