import IModel from '@models/primitives/slider/IModel';
import { Slider, SliderCustomEvents } from '@views/common-level/primitives/slider/slider';

interface IRangeSliderPresenter {
  readonly view: Slider;
  readonly model?: IModel;
  setModel(model: IModel): this;
}

class Presenter implements IRangeSliderPresenter {
  readonly view: Slider;

  constructor(slider: Slider, readonly model?: IModel) {
    this.view = slider;

    if (model !== undefined) {
      this.setModel(model);
    }
  }

  setModel(model: IModel) {
    model
      .getState()
      .then((state) => {
        this.view.set(state.value);

        return this;
      })
      .then(() => {
        const setHandler = (event: CustomEvent<SliderCustomEvents['set']>) => {
          model.setState({ value: event.detail.value });
        };

        this.view.addCustomEventListener('set', setHandler);
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

export default Presenter;
