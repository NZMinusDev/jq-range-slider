import IFacadeModel from '@shared/utils/scripts/components/MVP/IFacadeModel';

type Formatter = (value: number) => string;
type Mode = 'intervals' | 'count' | 'positions' | 'values';

type RangeSliderPresentationModelOptions = {
  intervals?: { min: number; max: number; [key: string]: number };
  start?: number | number[];
  steps?: 'none' | number | ('none' | number)[];
  connect?: boolean | boolean[];
  orientation?: 'horizontal' | 'vertical';
  padding?: number | [leftPad: number, rightPad: number];
  formatter?: Formatter;
  tooltips?: boolean | (boolean | Formatter)[];
  pips?: {
    mode?: Mode;
    values?: number | number[];
    density?: number;
    isHidden?: boolean;
  };
};

type RangeSliderPresentationModelNormalizedOptions = {
  intervals: { min: number; max: number; [key: string]: number };
  start: number[];
  steps: ('none' | number)[];
  connect: boolean[];
  orientation: 'horizontal' | 'vertical';
  padding: [leftPad: number, rightPad: number];
  formatter: Formatter;
  tooltips: (Formatter | boolean)[];
  pips: {
    mode: Mode;
    values: number | number[];
    density: number;
    isHidden: boolean;
  };
};

type RangeSliderPresentationModelState = {
  value: RangeSliderPresentationModelNormalizedOptions['start'];
  thumbs: {
    isActive: boolean;
  }[];
};

type RangeSliderFacadeModelState = Pick<
  RangeSliderPresentationModelState,
  'value'
>;

interface IRangeSliderFacadeModel
  extends IFacadeModel<RangeSliderFacadeModelState> {}

export {
  RangeSliderPresentationModelOptions,
  RangeSliderPresentationModelNormalizedOptions,
  RangeSliderPresentationModelState,
  RangeSliderFacadeModelState,
  IRangeSliderFacadeModel,
};
