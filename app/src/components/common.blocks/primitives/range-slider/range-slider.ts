import { renderMVPView } from "@utils/devTools/tools/PluginCreationHelper";
import { RangeSliderModel } from "./models/range-slider.decl.model";
import RangeSliderView from "./view/range-slider.view";

export default class RangeSlider {
  readonly view: RangeSliderView;

  constructor(
    viewParameters: ConstructorParameters<typeof RangeSliderView>,
    container: HTMLElement,
    readonly model?: RangeSliderModel
  ) {
    this.view = renderMVPView(RangeSliderView, viewParameters, container);
  }
}
