import type { MVPModel } from '@shared/utils/scripts/view/MVPHelper';

type RangeSliderState = {
  value: number[];
};

interface RangeSliderModel extends MVPModel<RangeSliderState> {}

export { RangeSliderModel as default, RangeSliderState };
