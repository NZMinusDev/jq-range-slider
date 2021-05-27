import IRangeSliderView, { RangeSliderOptions } from './view/range-slider.view.coupling';
import IRangeSliderModel from './models/range-slider.model.coupling';
interface IRangeSliderPresenter {
    view: IRangeSliderView;
    model?: IRangeSliderModel;
}
interface IRangeSliderPresenterConstructor {
    new (container: HTMLElement, viewOptions?: RangeSliderOptions, model?: IRangeSliderModel): IRangeSliderPresenter;
}
export { IRangeSliderPresenter as default, IRangeSliderPresenterConstructor };
