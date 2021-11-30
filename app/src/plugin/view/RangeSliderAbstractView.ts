import AbstractView from '@shared/utils/scripts/components/MVP/AbstractView';

import { TrackViewOptions } from './components/TrackView/types';
import { RangeViewOptions } from './components/RangeView/types';
import { ThumbViewState } from './components/ThumbView/types';
import {
  TooltipViewOptions,
  TooltipViewState,
} from './components/TooltipView/types';
import { PipsViewOptions } from './components/PipsView/types';
import {
  RangeSliderViewOptions,
  RangeSliderViewState,
  RangeSliderAbstractViewEvents,
} from './types';

abstract class RangeSliderAbstractView extends AbstractView<
  RangeSliderViewOptions,
  RangeSliderViewState,
  RangeSliderAbstractViewEvents
> {
  protected abstract _toTrackViewOptions(): TrackViewOptions;

  protected abstract _toRangeViewOptions(index: number): RangeViewOptions;

  protected abstract _toTooltipViewOptions(index: number): TooltipViewOptions;

  protected abstract _toPipsViewOptions(): PipsViewOptions;

  protected abstract _toThumbViewState(index: number): ThumbViewState;

  protected abstract _toTooltipViewState(index: number): TooltipViewState;
}

export { RangeSliderAbstractView as default };
