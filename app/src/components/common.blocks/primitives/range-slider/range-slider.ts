import { RangeSliderModel } from "./models/range-slider.decl.model";
import RangeSliderView from "./view/range-slider.view";

export default class RangeSlider {
  readonly view: RangeSliderView;

  constructor(
    readonly model: RangeSliderModel,
    viewParameters: ConstructorParameters<typeof RangeSliderView>
  ) {
    this.view = new RangeSliderView(...viewParameters);
  }
}
