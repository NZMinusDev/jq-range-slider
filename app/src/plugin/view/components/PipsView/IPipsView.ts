import { MVPView } from '@utils/devTools/scripts/PluginCreationHelper';

type Formatter = (value: number) => string;

type PipsOptions = {
  orientation?: 'horizontal' | 'vertical';
  isHidden?: boolean;
  values?: { percent: number; value: number }[];
  density?: number;
  formatter?: Formatter;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PipsState = {};

interface IPipsView
  extends MVPView<Required<PipsOptions>, PipsOptions, PipsState> {
  getOrientationOption(): PipsOptions['orientation'];
  getIsHiddenOption(): PipsOptions['isHidden'];
  getValuesOption(): PipsOptions['values'];
  getDensityOption(): PipsOptions['density'];
  getFormatterOption(): PipsOptions['formatter'];
  setOrientationOption(orientation?: PipsOptions['orientation']): this;
  setIsHiddenOption(isHidden?: PipsOptions['isHidden']): this;
  setValuesOption(values?: PipsOptions['values']): this;
  setDensityOption(density?: PipsOptions['density']): this;
  setFormatterOption(formatter?: PipsOptions['formatter']): this;
}

export { IPipsView as default, Formatter, PipsOptions, PipsState };
