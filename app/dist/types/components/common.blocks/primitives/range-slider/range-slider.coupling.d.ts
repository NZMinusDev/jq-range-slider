import IRangeSliderView, { RangeSliderOptions } from './view/range-slider.view.coupling';
import IRangeSliderModel from './models/range-slider.model.coupling';
export default interface RangeSliderPresenter {
    view: IRangeSliderView;
    model?: IRangeSliderModel;
}
export interface RangeSliderPresenterConstructor {
    new (container: HTMLElement, viewOptions?: RangeSliderOptions, model?: IRangeSliderModel): RangeSliderPresenter;
}
