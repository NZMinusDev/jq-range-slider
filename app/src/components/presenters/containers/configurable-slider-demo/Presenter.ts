import cloneDeep from 'lodash-es/cloneDeep';

import { Unpacked } from '@shared/utils/scripts/TypingHelper';
import IModel from '@models/containers/configurable-slider-demo/IModel';
import {
  ConfigurableSliderDemo,
  ConfigurableSliderDemoCustomEvents,
} from '@views/common-level/containers/configurable-slider-demo/configurable-slider-demo';

type ErrorCatcher = (reason: unknown) => void;

class Presenter {
  readonly view: ConfigurableSliderDemo;

  model?: IModel;

  constructor(
    configurableSliderDemo: ConfigurableSliderDemo,
    errorCatcher: ErrorCatcher,
    model?: IModel
  ) {
    this.view = configurableSliderDemo;

    if (model !== undefined) {
      this.setModel(model, errorCatcher);
    }
  }

  setModel(model: IModel, errorCatcher: ErrorCatcher) {
    if (this.model !== undefined) {
      this.model.closeConnections();
    }

    this.model = cloneDeep(model);

    this.model
      .getState()
      .then((state) => {
        this._initModelViewBinding();
        this._updateViewDisplay(state);

        return this;
      })
      .catch(errorCatcher);

    return this;
  }

  protected handleSliderViewSet = (
    event: CustomEvent<ConfigurableSliderDemoCustomEvents['set']>
  ) => {
    this.model?.setState({ value: event.detail.value });
  };

  protected _updateViewDisplay(
    state: Unpacked<ReturnType<IModel['getState']>>
  ) {
    const slider = this.view.getSlider();

    slider.set(state.value);
    this.view.addServerResponse(state.value.toString());

    return this;
  }

  protected _initModelViewBinding() {
    this.view.addCustomEventListener('set', this.handleSliderViewSet);
    this.model?.whenStateIsChanged((state) => {
      this._updateViewDisplay(state);
    });

    return this;
  }
}

export default Presenter;
