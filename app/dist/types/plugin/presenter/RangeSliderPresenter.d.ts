import { Unpacked } from "../../utils/devTools/scripts/TypingHelper";
import IRangeSliderModel from '../models/IRangeSliderModel';
import IRangeSliderView, { RangeSliderOptions } from '../view/IRangeSliderView';
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
