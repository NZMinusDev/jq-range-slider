import template from "./range-slider.view.pug";
import "./range-slider.scss";

import {
  TrackOptions,
  default as RangeSliderTrackView,
} from "./../__track/view/range-slider__track.view";
import {
  RangeOptions,
  default as RangeSliderRangeView,
} from "./../__range/view/range-slider__range.view";
import {
  ThumbOptions,
  default as RangeSliderThumbView,
} from "./../__thumb/view/range-slider__thumb.view";
import {
  TooltipOptions,
  default as RangeSliderTooltipView,
} from "./../__tooltip/view/range-slider__tooltip.view";
import {
  PipsOptions,
  default as RangeSliderPipsView,
} from "./../__pips/view/range-slider__pips.view";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderView extends MVPView<RangeSliderOptions> {
  getTrackOptions(): RangeSliderOptions["trackOptions"];
  getRangeOptions(): RangeSliderOptions["rangeOptions"];
  getThumbOptions(): RangeSliderOptions["thumbOptions"];
  getTooltipOptions(): RangeSliderOptions["tooltipOptions"];
  getPipsOptions(): RangeSliderOptions["pipsOptions"];
  setTrackOptions(trackOptions?: Partial<RangeSliderOptions["trackOptions"]>): this;
  setRangeOptions(rangeOptions?: Partial<RangeSliderOptions["rangeOptions"]>): this;
  setThumbOptions(thumbOptions?: Partial<RangeSliderOptions["thumbOptions"]>): this;
  setTooltipOptions(tooltipOptions?: Partial<RangeSliderOptions["tooltipOptions"]>): this;
  setPipsOptions(pipsOptions?: Partial<RangeSliderOptions["pipsOptions"]>): this;

  getValue(): Array<number>;
  setValue(value?: number | Array<number>): this;

  whenIsStarted(callback: eventHandler): void;
  whenIsSlid(callback: eventHandler): void;
  whenIsUpdated(callback: eventHandler): void;
  whenIsChanged(callback: eventHandler): void;
  whenIsSet(callback: eventHandler): void;
  whenIsEnded(callback: eventHandler): void;
}

export default class RangeSliderView {}

export type RangeSliderOptions = {
  trackOptions: TrackOptions;
  rangeOptions: RangeOptions;
  thumbOptions: ThumbOptions;
  tooltipOptions: TooltipOptions;
  pipsOptions: PipsOptions;
};

interface eventHandler {
  (values: Array<number>, isTapped: boolean): void;
}
