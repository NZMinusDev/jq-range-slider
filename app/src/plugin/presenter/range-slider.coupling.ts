import IRangeSliderView, { RangeSliderOptions } from '../view/range-slider.view.coupling';
import IRangeSliderModel from '../models/range-slider.model.coupling';

interface IRangeSliderPresenter {
  readonly view: IRangeSliderView;
  readonly model?: IRangeSliderModel;
  setModel(model: IRangeSliderModel): this;
}

interface IRangeSliderPresenterConstructor {
  new (
    container: HTMLElement,
    viewOptions?: RangeSliderOptions,
    model?: IRangeSliderModel
  ): IRangeSliderPresenter;
}

export { IRangeSliderPresenter as default, IRangeSliderPresenterConstructor };
