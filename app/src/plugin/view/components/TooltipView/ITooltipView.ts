import { MVPView } from '@utils/devTools/scripts/view/MVPHelper';

type Formatter = (value: number) => string;

type TooltipOptions = {
  orientation?: 'top' | 'left';
  isHidden?: boolean;
  formatter?: Formatter;
};

type TooltipState = {
  value: number;
};

interface ITooltipView
  extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState> {
  getOrientationOption(): TooltipOptions['orientation'];
  getIsHiddenOption(): TooltipOptions['isHidden'];
  getFormatterOption(): TooltipOptions['formatter'];
  setOrientationOption(orientation: TooltipOptions['orientation']): this;
  setIsHiddenOption(isHidden?: TooltipOptions['isHidden']): this;
  setFormatterOption(formatter?: TooltipOptions['formatter']): this;
}

export { ITooltipView as default, Formatter, TooltipOptions, TooltipState };
