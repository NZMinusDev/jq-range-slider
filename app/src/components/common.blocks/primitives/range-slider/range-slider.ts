import { RangeSliderModel } from "./models/range-slider.decl.model";
import RangeSliderView, { RangeSliderOptions } from "./view/range-slider.view";

export default class RangeSlider {
  private view;

  constructor(
    private model: RangeSliderModel,
    container: HTMLElement,
    rangeSliderOptions?: Partial<RangeSliderOptions>
  ) {
    this.view = new RangeSliderView(container, rangeSliderOptions);
  }
}
