import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

export type Formatter = (value: number) => string;

export type TooltipOptions = {
  orientation?: 'top' | 'left';
  isHidden?: boolean;
  formatter?: Formatter;
};

export type TooltipState = {
  value: number;
};

export default interface RangeSliderTooltipView
  extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState> {
  getOrientationOption(): TooltipOptions['orientation'];
  getIsHiddenOption(): TooltipOptions['isHidden'];
  getFormatterOption(): TooltipOptions['formatter'];
  setOrientationOption(orientation: TooltipOptions['orientation']): this;
  setIsHiddenOption(isHidden?: TooltipOptions['isHidden']): this;
  setFormatterOption(formatter?: TooltipOptions['formatter']): this;
}
