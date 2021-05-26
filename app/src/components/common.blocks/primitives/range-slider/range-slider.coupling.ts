import IRangeSliderView, { RangeSliderOptions } from './view/range-slider.view.coupling';
import IRangeSliderModel from './models/range-slider.model.coupling';

interface RangeSliderPresenter {
  view: IRangeSliderView;
  model?: IRangeSliderModel;
}

interface RangeSliderPresenterConstructor {
  new (
    container: HTMLElement,
    viewOptions?: RangeSliderOptions,
    model?: IRangeSliderModel
  ): RangeSliderPresenter;
}

export { RangeSliderPresenter as default, RangeSliderPresenterConstructor };
