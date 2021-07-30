import { renderMVPView } from '@utils/devTools/scripts/PluginCreationHelper';

import IRangeSliderView, { RangeSliderOptions } from '../view/range-slider.view.coupling';
import IRangeSliderModel from '../models/range-slider.model.coupling';
import IRangeSliderPresenter from './range-slider.coupling';

import RangeSliderView from '../view/range-slider.view';

class RangeSliderPresenter implements IRangeSliderPresenter {
  readonly view: IRangeSliderView;

  constructor(
    container: HTMLElement,
    viewOptions?: RangeSliderOptions,
    readonly model?: IRangeSliderModel
  ) {
    this.view = renderMVPView(RangeSliderView, [viewOptions] as [RangeSliderOptions], container);

    if (model !== undefined) {
      this.setModel(model);
    }
  }

  setModel(model: IRangeSliderModel) {
    model
      .getState()
      .then((state) => {
        this.view.set(state.value);

        return this;
      })
      .then(() => {
        const setHandler = () => {
          model.setState({ value: this.view.get() });
        };

        this.view.on('set', setHandler);
        model.whenStateIsChanged((state) => {
          this.view.set(state.value);
        });

        return this;
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
        console.error(reason);
      });

    return this;
  }
}

export default RangeSliderPresenter;
