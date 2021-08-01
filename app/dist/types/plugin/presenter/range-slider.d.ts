import { Unpacked } from "../../utils/devTools/scripts/TypingHelper";
import IRangeSliderView, { RangeSliderOptions } from '../view/range-slider.view.coupling';
import IRangeSliderModel from '../models/range-slider.model.coupling';
declare type ErrorCatcher = (reason: unknown) => void;
declare class RangeSliderPresenter {
    readonly view: IRangeSliderView;
    model?: IRangeSliderModel;
    constructor(container: HTMLElement, errorCatcher: ErrorCatcher, viewOptions?: RangeSliderOptions, model?: IRangeSliderModel);
    setModel(model: IRangeSliderModel, errorCatcher: ErrorCatcher): this;
    protected handleViewSet: () => void;
    protected _updateViewDisplay(state: Unpacked<ReturnType<IRangeSliderModel['getState']>>): this;
    protected _initModelViewBinding(): this;
}
interface RangeSliderPresenterConstructor {
    new (container: HTMLElement, errorCatcher: ErrorCatcher, viewOptions?: RangeSliderOptions, model?: IRangeSliderModel): RangeSliderPresenter;
}
export { RangeSliderPresenter as default, RangeSliderPresenterConstructor, ErrorCatcher };
