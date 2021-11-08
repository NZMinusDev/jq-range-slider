import { MVPView } from '@shared/utils/scripts/view/MVPHelper';

import { TrackOptions, FixedTrackOptions } from './components/TrackView/types';
import { RangeOptions } from './components/RangeView/types';
import { TooltipOptions } from './components/TooltipView/types';
import { PipsOptions } from './components/PipsView/types';

type Formatter = (value: number) => string;
type Mode = 'intervals' | 'count' | 'positions' | 'values';

type RangeSliderOptions = {
  intervals?: TrackOptions['intervals'];
  start?: number | number[];
  steps?: TrackOptions['steps'];
  connect?:
    | NonNullable<RangeOptions['isConnected']>
    | Required<RangeOptions>['isConnected'][];
  orientation?: 'horizontal' | 'vertical';
  padding?: TrackOptions['padding'];
  formatter?: Formatter;
  tooltips?: boolean | (NonNullable<TooltipOptions['formatter']> | boolean)[];
  pips?: Omit<PipsOptions, 'formatter' | 'values' | 'orientation'> & {
    mode?: Mode;
    values?: number | number[];
  };
};
type FixedRangeSliderOptions = {
  intervals: Required<RangeSliderOptions>['intervals'];
  start: number[];
  steps: FixedTrackOptions['steps'];
  connect: Required<RangeOptions>['isConnected'][];
  orientation: Required<RangeSliderOptions>['orientation'];
  padding: FixedTrackOptions['padding'];
  formatter: Required<RangeSliderOptions>['formatter'];
  tooltips: (Required<TooltipOptions>['formatter'] | boolean)[];
  pips: NonNullable<Required<RangeSliderOptions['pips']>>;
};

type RangeSliderState = {
  value: FixedRangeSliderOptions['start'];
  isActiveThumbs: boolean[];
};

interface RangeSliderView
  extends MVPView<
    FixedRangeSliderOptions,
    RangeSliderOptions,
    RangeSliderState,
    'start' | 'slide' | 'update' | 'change' | 'set' | 'end'
  > {
  getIntervalsOption(): FixedRangeSliderOptions['intervals'];
  getStartOption(): FixedRangeSliderOptions['start'];
  getStepsOption(): FixedRangeSliderOptions['steps'];
  getConnectOption(): FixedRangeSliderOptions['connect'];
  getOrientationOption(): FixedRangeSliderOptions['orientation'];
  getPaddingOption(): FixedRangeSliderOptions['padding'];
  getFormatterOption(): FixedRangeSliderOptions['formatter'];
  getTooltipsOption(): FixedRangeSliderOptions['tooltips'];
  getPipsOption(): FixedRangeSliderOptions['pips'];
  setIntervalsOption(intervals?: RangeSliderOptions['intervals']): this;
  setStartOption(start?: RangeSliderOptions['start']): this;
  setStepsOption(steps?: RangeSliderOptions['steps']): this;
  setConnectOption(connect?: RangeSliderOptions['connect']): this;
  setOrientationOption(orientation?: RangeSliderOptions['orientation']): this;
  setPaddingOption(padding?: RangeSliderOptions['padding']): this;
  setFormatterOption(formatter?: RangeSliderOptions['formatter']): this;
  setTooltipsOption(tooltips?: RangeSliderOptions['tooltips']): this;
  setPipsOption(pips?: RangeSliderOptions['pips']): this;

  get(): FixedRangeSliderOptions['start'];
  set(value?: RangeSliderOptions['start']): this;
}

export {
  RangeSliderView as default,
  Formatter,
  Mode,
  RangeSliderOptions,
  FixedRangeSliderOptions,
  RangeSliderState,
};
