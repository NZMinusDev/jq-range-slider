import {
  RangeSliderPresentationModelNormalizedOptions,
  RangeSliderPresentationModelState,
} from './types';

const DEFAULT_OPTIONS: RangeSliderPresentationModelNormalizedOptions = {
  intervals: { min: -100, max: 100 },
  start: [0],
  steps: ['none'],
  connect: [false, false],
  orientation: 'horizontal',
  padding: [0, 0],
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
  tooltips: [true],
  pips: {
    mode: 'intervals',
    values: [-100, 100],
    density: 1,
    isHidden: false,
  },
};

const DEFAULT_STATE: Required<RangeSliderPresentationModelState> = {
  value: [0],
  thumbs: [
    {
      isActive: false,
    },
  ],
};

export { DEFAULT_OPTIONS, DEFAULT_STATE };
