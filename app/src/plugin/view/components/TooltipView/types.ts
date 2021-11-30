import { AbstractViewEvents } from '@shared/utils/scripts/components/MVP/AbstractView';

type Formatter = (value: number) => string;

type TooltipViewOptions = {
  orientation: 'top' | 'left';
  isHidden: boolean;
  formatter: Formatter;
};

type TooltipViewState = {
  value: number;
};

type TooltipViewIsolatedEvents = AbstractViewEvents & {};

export {
  Formatter,
  TooltipViewOptions,
  TooltipViewState,
  TooltipViewIsolatedEvents,
};
