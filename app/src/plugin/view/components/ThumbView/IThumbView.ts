import { MVPView } from '@utils/devTools/scripts/PluginCreationHelper';

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
interface IThumbView extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState> {}

export { IThumbView as default, ThumbOptions, ThumbState };
