import { MVPView } from '@shared/utils/scripts/view/MVPHelper';

type Formatter = (value: number) => string;

type PipsOptions = {
  orientation?: 'horizontal' | 'vertical';
  isHidden?: boolean;
  values?: { percent: number; value: number }[];
  density?: number;
  formatter?: Formatter;
};

type PipsState = {};

interface PipsView
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

export { PipsView as default, Formatter, PipsOptions, PipsState };
