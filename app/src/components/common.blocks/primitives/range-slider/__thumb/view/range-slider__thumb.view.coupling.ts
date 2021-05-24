import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

export type ThumbOptions = {
  // options
};

export type ThumbState = {
  ariaOrientation: 'horizontal' | 'vertical';
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface RangeSliderThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {}
