import { MVPView } from '@shared/utils/scripts/view/MVPHelper';

type ThumbOptions = {};

type ThumbState = {
  ariaOrientation: 'horizontal' | 'vertical';
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};

interface ThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {}

export { ThumbView as default, ThumbOptions, ThumbState };
