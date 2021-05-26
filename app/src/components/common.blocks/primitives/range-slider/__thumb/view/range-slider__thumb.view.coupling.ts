import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

// eslint-disable-next-line @typescript-eslint/ban-types
type ThumbOptions = {};

type ThumbState = {
  ariaOrientation: 'horizontal' | 'vertical';
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RangeSliderThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {}

export { RangeSliderThumbView as default, ThumbOptions, ThumbState };
