import cloneDeep from 'lodash-es/cloneDeep';

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
    this.model = cloneDeep(model);

    this.model
      .getState()
      .then((state) => {
        const slider = this.view.getSlider();

        slider.set(state.value);
        this.view.addServerResponse(state.value.toString());

        return this;
      })
      .then(() => {
        const handleSliderViewUpdate = (
          event: CustomEvent<ConfigurableSliderDemoCustomEvents['update']>
        ) => {
          this.model?.setState({ value: event.detail.value });
        };

        this.view.addCustomEventListener('update', handleSliderViewUpdate);
        this.model?.whenStateIsChanged((state) => {
          const slider = this.view.getSlider();

          slider.set(state.value);
          this.view.addServerResponse(state.value.toString());
        });

        return this;
      })
      .catch(errorCatcher);

    return this;
  }
}

export default Presenter;
