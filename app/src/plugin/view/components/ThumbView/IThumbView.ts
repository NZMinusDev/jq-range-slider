import { MVPView } from '@shared/utils/scripts/view/MVPHelper';

type ThumbOptions = {};

type ThumbState = {
  ariaOrientation: 'horizontal' | 'vertical';
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};

interface IThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {}

export { IThumbView as default, ThumbOptions, ThumbState };
