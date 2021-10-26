import type { MVPModel } from '@shared/utils/scripts/view/MVPHelper';

type RangeSliderState = {
  value: number[];
};

interface IRangeSliderModel extends MVPModel<RangeSliderState> {}

export { IRangeSliderModel as default, RangeSliderState };
