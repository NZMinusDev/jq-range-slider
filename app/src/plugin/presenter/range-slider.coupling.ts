import IRangeSliderView, { RangeSliderOptions } from '../view/range-slider.view.coupling';
import IRangeSliderModel from '../models/range-slider.model.coupling';

type ErrorCatcher = (reason: unknown) => void;

interface IRangeSliderPresenter {
  readonly view: IRangeSliderView;
  model?: IRangeSliderModel;
  setModel(model: IRangeSliderModel, errorCatcher: ErrorCatcher): this;
}

interface IRangeSliderPresenterConstructor {
  new (
    container: HTMLElement,
    errorCatcher: ErrorCatcher,
    viewOptions?: RangeSliderOptions,
    model?: IRangeSliderModel
  ): IRangeSliderPresenter;
}

export { IRangeSliderPresenter as default, ErrorCatcher, IRangeSliderPresenterConstructor };
