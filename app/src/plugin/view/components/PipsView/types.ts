import { AbstractViewEvents } from '@shared/utils/scripts/components/MVP/AbstractView';
import { Unpacked } from '@shared/utils/scripts/types/utility';

type Formatter = (value: number) => string;

type PipsViewOptions = {
  orientation: 'horizontal' | 'vertical';
  isHidden: boolean;
  values: { percent: number; value: number }[];
  density: number;
  formatter: Formatter;
};

type PipsViewState = {};

type PipsViewIsolatedEvents = AbstractViewEvents & {};

type PipsViewDOMEvents = {
  click: PointerEvent & { data: Unpacked<PipsViewOptions['values']> };
};

export {
  Formatter,
  PipsViewOptions,
  PipsViewState,
  PipsViewIsolatedEvents,
  PipsViewDOMEvents,
};
