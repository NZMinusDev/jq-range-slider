import { AbstractViewEvents } from '@shared/utils/scripts/components/MVP/AbstractView';

import { RangeViewOptions } from './components/RangeView/types';
import { TooltipViewOptions } from './components/TooltipView/types';
import { PipsViewOptions } from './components/PipsView/types';

type Formatter = (value: number) => string;
type Mode = 'intervals' | 'count' | 'positions' | 'values';

type RangeSliderViewOptions = {
  intervals: { min: number; max: number; [key: string]: number };
  start: number[];
  steps: ('none' | number)[];
  connect: RangeViewOptions['isConnected'][];
  orientation: 'horizontal' | 'vertical';
  padding: [leftPad: number, rightPad: number];
  formatter: Formatter;
  tooltips: (TooltipViewOptions['formatter'] | boolean)[];
  pips: Omit<PipsViewOptions, 'values' | 'formatter' | 'orientation'> & {
    values: number | number[];
    mode: Mode;
  };
};

type RangeSliderViewState = {
  value: RangeSliderViewOptions['start'];
  thumbs: {
    isActive: boolean;
  }[];
};

type RangeSliderViewDOM = {};

type RangeSliderAbstractViewEvents = AbstractViewEvents & {
  start: { thumbIndex: number };
  slide: { thumbIndex: number; newValue: number };
  update: {};
  change: {};
  set: {};
  end: { thumbIndex: number };
};

export {
  Formatter,
  Mode,
  RangeSliderViewOptions,
  RangeSliderViewState,
  RangeSliderViewDOM,
  RangeSliderAbstractViewEvents,
};
