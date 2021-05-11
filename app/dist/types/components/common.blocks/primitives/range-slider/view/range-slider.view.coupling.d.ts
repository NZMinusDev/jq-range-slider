import { TrackOptions, FixedTrackOptions } from "../__track/view/range-slider__track.view.coupling";
import { RangeOptions } from "../__range/view/range-slider__range.view.coupling";
import { TooltipOptions } from "../__tooltip/view/range-slider__tooltip.view.coupling";
import { PipsOptions } from "../__pips/view/range-slider__pips.view.coupling";
import { MVPView } from "../../../../../utils/devTools/tools/PluginCreationHelper";
export default interface RangeSliderView extends MVPView<FixedRangeSliderOptions, RangeSliderOptions, RangeSliderState, "start" | "slide" | "update" | "change" | "set" | "end"> {
    getIntervalsOption(): FixedRangeSliderOptions["intervals"];
    getStartOption(): FixedRangeSliderOptions["start"];
    getStepsOption(): FixedRangeSliderOptions["steps"];
    getConnectOption(): FixedRangeSliderOptions["connect"];
    getOrientationOption(): FixedRangeSliderOptions["orientation"];
    getPaddingOption(): FixedRangeSliderOptions["padding"];
    getFormatterOption(): FixedRangeSliderOptions["formatter"];
    getTooltipsOption(): FixedRangeSliderOptions["tooltips"];
    getPipsOption(): FixedRangeSliderOptions["pips"];
    setIntervalsOption(intervals?: RangeSliderOptions["intervals"]): this;
    setStartOption(start?: RangeSliderOptions["start"]): this;
    setStepsOption(steps?: RangeSliderOptions["steps"]): this;
    setConnectOption(connect?: RangeSliderOptions["connect"]): this;
    setOrientationOption(orientation?: RangeSliderOptions["orientation"]): this;
    setPaddingOption(padding?: RangeSliderOptions["padding"]): this;
    setFormatterOption(formatter?: RangeSliderOptions["formatter"]): this;
    setTooltipsOption(tooltips?: RangeSliderOptions["tooltips"]): this;
    setPipsOption(pips?: RangeSliderOptions["pips"]): this;
    get(): FixedRangeSliderOptions["start"];
    set(value?: RangeSliderOptions["start"]): this;
}
export declare type RangeSliderOptions = {
    intervals?: TrackOptions["intervals"];
    start?: number | number[];
    steps?: TrackOptions["steps"];
    connect?: NonNullable<RangeOptions["isConnected"]> | Required<RangeOptions>["isConnected"][];
    orientation?: "horizontal" | "vertical";
    padding?: TrackOptions["padding"];
    formatter?: Formatter;
    tooltips?: boolean | (NonNullable<TooltipOptions["formatter"]> | boolean)[];
    pips?: Omit<PipsOptions, "formatter" | "values" | "orientation"> & {
        mode?: Mode;
        values?: number | number[];
    };
};
export declare type FixedRangeSliderOptions = {
    intervals: Required<RangeSliderOptions>["intervals"];
    start: number[];
    steps: FixedTrackOptions["steps"];
    connect: Required<RangeOptions>["isConnected"][];
    orientation: Required<RangeSliderOptions>["orientation"];
    padding: FixedTrackOptions["padding"];
    formatter: Required<RangeSliderOptions>["formatter"];
    tooltips: (Required<TooltipOptions>["formatter"] | boolean)[];
    pips: NonNullable<Required<RangeSliderOptions["pips"]>>;
};
export declare type RangeSliderState = {
    value: FixedRangeSliderOptions["start"];
    isActiveThumbs: boolean[];
};
export declare type Formatter = (value: number) => string;
export declare type Mode = "intervals" | "count" | "positions" | "values";
