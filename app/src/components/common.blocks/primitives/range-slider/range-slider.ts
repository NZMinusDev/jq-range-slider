import { render } from "lit-html";
import { RangeSliderModel } from "./models/range-slider.decl.model";
import RangeSliderView from "./view/range-slider.view";

export default class RangeSlider {
  readonly view: RangeSliderView;

  constructor(
    readonly model: RangeSliderModel,
    viewParameters: ConstructorParameters<typeof RangeSliderView>,
    container: HTMLElement
  ) {
    this.view = new RangeSliderView(...viewParameters);
    render(this.view.template({}, {}), container);

    this.view.on("render", () => {
      render(this.view.template({}, {}), container);
    });
    this.view.on("remove", () => {
      render(RangeSliderView.templateOfRemoving(), container);
    });
  }
}
