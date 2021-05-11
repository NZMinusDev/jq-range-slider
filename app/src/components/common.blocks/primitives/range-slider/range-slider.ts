import IRangeSliderPresenter from "./range-slider.coupling";

import IRangeSliderView, { RangeSliderOptions } from "./view/range-slider.view.coupling";
import IRangeSliderModel from "./models/range-slider.model.coupling";

import RangeSliderView from "./view/range-slider.view";

import { renderMVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default class RangeSliderPresenter implements IRangeSliderPresenter {
  readonly view: IRangeSliderView;

  constructor(
    container: HTMLElement,
    viewOptions?: RangeSliderOptions,
    readonly model?: IRangeSliderModel
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
