import defaultsDeep from 'lodash-es/defaultsDeep';

import { renderMVPView } from '@utils/devTools/scripts/PluginCreationHelper';

import IRangeSliderView, { RangeSliderOptions } from '../view/range-slider.view.coupling';
import RangeSliderView from '../view/range-slider.view';
import IRangeSliderModel from '../models/range-slider.model.coupling';
import IRangeSliderPresenter, { ErrorCatcher } from './range-slider.coupling';

class RangeSliderPresenter implements IRangeSliderPresenter {
  readonly view: IRangeSliderView;
  model?: IRangeSliderModel;

  constructor(
    container: HTMLElement,
    errorCatcher: ErrorCatcher,
    viewOptions?: RangeSliderOptions,
    model?: IRangeSliderModel
  ) {
    this.view = renderMVPView(RangeSliderView, [viewOptions] as [RangeSliderOptions], container);

    if (model !== undefined) {
      this.setModel(model, errorCatcher);
    }
  }

  setModel(model: IRangeSliderModel, errorCatcher: ErrorCatcher) {
    this.model = defaultsDeep({}, model);

    this.model
      ?.getState()
      .then((state) => {
        this.view.set(state.value);

        return this;
      })
      .then(() => {
        const handleViewUpdate = () => {
          this.model?.setState({ value: this.view.get() });
        };

        this.view.on('update', handleViewUpdate);
        this.model?.whenStateIsChanged((state) => {
          this.view.set(state.value);
        });

        return this;
      })
      .catch(errorCatcher);

    return this;
  }
}

export default RangeSliderPresenter;
