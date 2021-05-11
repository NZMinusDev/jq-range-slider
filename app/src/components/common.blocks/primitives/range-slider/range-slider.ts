import { renderMVPView } from "@utils/devTools/tools/PluginCreationHelper";
import { RangeSliderModel } from "./models/range-slider.model";
import RangeSliderView from "./view/range-slider.view";

export default class RangeSlider {
  readonly view: RangeSliderView;

  constructor(
    container: HTMLElement,
    viewOptions?: RangeSliderOptions,
    readonly model?: RangeSliderModel
  ) {
    this.view = renderMVPView(RangeSliderView, [viewOptions] as [RangeSliderOptions], container);

    if (model !== undefined) {
      model
        .getState()
        .then((state) => {
          this.view.set(state.value);
        })
        .then(() => {
          this.view.on("set", () => {
            model.setState({ value: this.view.get() });
          });
          model.whenStateIsChanged((state) => {
            this.view.set(state.value);
          });
        });
    }
  }
}
