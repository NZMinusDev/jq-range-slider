import "./range-slider.scss";
import IRangeSliderView, { RangeSliderOptions, FixedRangeSliderOptions, RangeSliderState, Formatter } from "./range-slider.view.coupling";
import { FixedTrackOptions, TrackOptions } from "../__track/view/range-slider__track.view.coupling";
import { RangeOptions } from "../__range/view/range-slider__range.view.coupling";
import { ThumbOptions, ThumbState } from "../__thumb/view/range-slider__thumb.view.coupling";
import { TooltipOptions, TooltipState } from "../__tooltip/view/range-slider__tooltip.view.coupling";
import { PipsOptions } from "../__pips/view/range-slider__pips.view.coupling";
import { TemplateResult } from "lit-html";
import { MVPView } from "../../../../../utils/devTools/tools/PluginCreationHelper";
export declare const DEFAULT_OPTIONS: FixedRangeSliderOptions;
export declare const DEFAULT_STATE: RangeSliderState;
export default class RangeSliderView extends MVPView<FixedRangeSliderOptions, RangeSliderOptions, RangeSliderState, "start" | "slide" | "update" | "change" | "set" | "end"> implements IRangeSliderView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => TemplateResult;
    constructor(options?: RangeSliderOptions, state?: RangeSliderState);
    getIntervalsOption(): {
        [x: string]: number;
        min: number;
        max: number;
    };
    getStartOption(): number[];
    getStepsOption(): (number | "none")[];
    getConnectOption(): boolean[];
    getOrientationOption(): "horizontal" | "vertical";
    getPaddingOption(): [number, number];
    getFormatterOption(): Formatter;
    getTooltipsOption(): (boolean | Formatter)[];
    getPipsOption(): any;
    setIntervalsOption(intervals?: RangeSliderOptions["intervals"]): this;
    setStartOption(start?: RangeSliderOptions["start"]): this;
    setStepsOption(steps?: RangeSliderOptions["steps"]): this;
    setConnectOption(connect?: RangeSliderOptions["connect"]): this;
    setOrientationOption(orientation?: RangeSliderOptions["orientation"]): this;
    setPaddingOption(padding?: RangeSliderOptions["padding"]): this;
    setFormatterOption(formatter?: RangeSliderOptions["formatter"]): this;
    setTooltipsOption(tooltips?: RangeSliderOptions["tooltips"]): this;
    setPipsOption(pips?: RangeSliderOptions["pips"]): this;
    setOptions(options?: RangeSliderOptions): this;
    get(): number[];
    set(value?: RangeSliderOptions["start"]): this;
    protected _setValueState(value?: RangeSliderState["value"]): this;
    protected _fixIntervalsOption(): this;
    protected _fixPaddingOption(): this;
    protected _fixStartOption(): this;
    protected _fixStepsOption(): this;
    protected _fixPipsOption(): this;
    protected _fixConnectOption(): this;
    protected _fixTooltipsOption(): this;
    protected _fixValueState(): this;
    protected _fixIsActiveThumbsState(): void;
    protected _getValueBorderOfTrack(): {
        min: number;
        max: number;
    };
    protected _getLinearPercentBorderOfTrack(): {
        min: number;
        max: number;
    };
    protected _getIntervalInfoByPoint(value: number, { isIncludedInSupremum }?: {
        isIncludedInSupremum?: boolean | undefined;
    }): {
        keyOfInfimum: string;
        keyOfSupremum?: undefined;
        valueSize?: undefined;
        percentSize?: undefined;
        magnificationFactor?: undefined;
        step?: undefined;
    } | {
        keyOfSupremum: string;
        keyOfInfimum?: undefined;
        valueSize?: undefined;
        percentSize?: undefined;
        magnificationFactor?: undefined;
        step?: undefined;
    } | {
        keyOfInfimum: string;
        keyOfSupremum: string;
        valueSize: number;
        percentSize: number;
        magnificationFactor: number;
        step: number | "none";
    };
    protected _getIntervalKeyAsNumber(key: keyof Required<TrackOptions>["intervals"]): number;
    protected _toTrackPercent(valueOnTrack: number): number;
    protected _toTrackValue(linearPercentOnTrack: number): number;
    protected _toTrackOptions(): FixedTrackOptions;
    protected _toRangeOptions(index: number): Required<RangeOptions>;
    protected _toThumbOptions(index: number): Required<ThumbOptions>;
    protected _toTooltipOptions(index: number): Required<TooltipOptions>;
    protected _toPipsOptions(): Required<PipsOptions>;
    protected _toThumbState(index: number): ThumbState;
    protected _toTooltipState(index: number): TooltipState;
    protected _thumbEventListenerObject: {
        handleEvent: (event: Event) => void;
    };
    protected _getThumbConstants(thumbElem: HTMLElement): {
        trackElem: HTMLElement;
        thumbIndex: number;
        trackValueSize: number;
        siblingRanges: [HTMLElement, HTMLElement];
        getCalculated: () => {
            valuePerPx: number;
        };
    };
    protected _fixNonLinearShiftThroughIntervals(currentIntervalInfo: {
        keyOfInfimum: string;
        keyOfSupremum: string;
        magnificationFactor: number;
        step: number | "none";
    }, thumbValueAfterIncrementation: number, thumbValueIncrementation: number, movement: number, valuePerPx: number): {
        thumbValueAfterIncrementation: number;
        increments: number[];
        currentIntervalInfo: {
            keyOfInfimum: string;
            keyOfSupremum: string;
            magnificationFactor: number;
            step: number | "none";
        };
    };
    protected _toThumbSteppedIncrementation(thumbIncrementationOfLastInterval: number, step: number | "none"): number;
    protected _thumbValueToPositionOnTrack(thumbIndex: number): {
        offsetOnTrackInPercent: number;
        THUMB_SCALE_FACTOR: number;
        THUMB_TO_CENTER_OFFSET: number;
    };
    protected _trackEventListenerObject: {
        handleEvent: (event: Event) => void;
    };
    protected _getNearestThumb(value: number): number;
    protected _pipsEventListenerObject: {
        handleEvent: (event: Event) => void;
    };
}