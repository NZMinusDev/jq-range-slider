import IRangeSliderView, { RangeSliderOptions } from './view/range-slider.view.coupling';
import IRangeSliderModel from './models/range-slider.model.coupling';
import IRangeSliderPresenter from './range-slider.coupling';
declare class RangeSliderPresenter implements IRangeSliderPresenter {
    readonly model?: IRangeSliderModel | undefined;
    readonly view: IRangeSliderView;
    constructor(container: HTMLElement, viewOptions?: RangeSliderOptions, model?: IRangeSliderModel | undefined);
    setModel(model: IRangeSliderModel): this;
}
export default RangeSliderPresenter;
