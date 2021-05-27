import { MVPView } from "../../../../../utils/devTools/tools/PluginCreationHelper";
import './range-slider.scss';
import IRangeSliderView, { RangeSliderOptions, FixedRangeSliderOptions, RangeSliderState } from './range-slider.view.coupling';
import { FixedTrackOptions, TrackOptions } from '../__track/view/range-slider__track.view.coupling';
import { RangeOptions } from '../__range/view/range-slider__range.view.coupling';
import { ThumbOptions, ThumbState } from '../__thumb/view/range-slider__thumb.view.coupling';
import { TooltipOptions, TooltipState } from '../__tooltip/view/range-slider__tooltip.view.coupling';
import { PipsOptions } from '../__pips/view/range-slider__pips.view.coupling';
declare const DEFAULT_OPTIONS: FixedRangeSliderOptions;
declare const DEFAULT_STATE: RangeSliderState;
declare class RangeSliderView extends MVPView<FixedRangeSliderOptions, RangeSliderOptions, RangeSliderState, 'start' | 'slide' | 'update' | 'change' | 'set' | 'end'> implements IRangeSliderView {
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }) => import("lit-html").TemplateResult;
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
    getFormatterOption(): import("./range-slider.view.coupling").Formatter;
    getTooltipsOption(): (boolean | import("../__tooltip/view/range-slider__tooltip.view.coupling").Formatter)[];
    getPipsOption(): any;
    setIntervalsOption(intervals?: RangeSliderOptions['intervals']): this;
    setStartOption(start?: RangeSliderOptions['start']): this;
    setStepsOption(steps?: RangeSliderOptions['steps']): this;
    setConnectOption(connect?: RangeSliderOptions['connect']): this;
    setOrientationOption(orientation?: RangeSliderOptions['orientation']): this;
    setPaddingOption(padding?: RangeSliderOptions['padding']): this;
    setFormatterOption(formatter?: RangeSliderOptions['formatter']): this;
    setTooltipsOption(tooltips?: RangeSliderOptions['tooltips']): this;
    setPipsOption(pips?: RangeSliderOptions['pips']): this;
    setOptions(options?: RangeSliderOptions): this;
    get(): number[];
    set(value?: RangeSliderOptions['start']): this;
    protected _setValueState(value?: RangeSliderState['value']): this;
    protected _fixIntervalsOption(): this;
    protected _fixPaddingOption(): this;
    protected _fixStartOption(): this;
    protected _fixStepsOption(): this;
    protected _fixPipsOption(): this;
    protected _fixPipsOptionDependOnMode(): void;
    protected _fixPipsOptionWithIntervalsMode(): void;
    protected _fixPipsOptionWithCountMode(): void;
    protected _fixPipsOptionWithPositionsMode(): void;
    protected _fixPipsOptionWithValuesMode(): void;
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
    protected static _getIntervalKeyAsNumber(key: keyof Required<TrackOptions>['intervals']): number;
    protected _toTrackPercent(valueOnTrack: number): number;
    protected _toTrackValue(linearPercentOnTrack: number): number;
    protected _toTrackOptions(): FixedTrackOptions;
    protected _toRangeOptions(index: number): Required<RangeOptions>;
    protected _toThumbOptions(index: number): Required<ThumbOptions>;
    protected _toTooltipOptions(index: number): Required<TooltipOptions>;
    protected _toPipsOptions(): Required<PipsOptions>;
    protected _toThumbState(index: number): ThumbState;
    protected _toTooltipState(index: number): TooltipState;
    protected _getRangeTransform(index: number): string;
    protected _getThumbTransform(index: number): string;
    protected _getThumbZIndex(index: number): string;
    protected _thumbEventListenerObject: {
        cache: WeakMap<HTMLElement, {
            trackElem: HTMLElement;
            thumbIndex: number;
            movementAcc: number;
            trackValueSize: number;
            siblingRanges: [HTMLElement, HTMLElement];
            getCalculated: () => {
                valuePerPx: number;
            };
        }>;
        handleEvent: (event: Event) => void;
        _onPointerdown: (event: PointerEvent) => void;
        _onPointermove: (event: PointerEvent) => void;
        _onLostpointercapture: (event: PointerEvent) => void;
        getOrigin(event: Event): HTMLElement;
    };
    protected _initThumbCache(origin: HTMLElement): {
        trackElem: HTMLElement;
        thumbIndex: number;
        movementAcc: number;
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
        step: number | 'none';
    }, thumbValueAfterIncrementation: number, thumbValueIncrementation: number, movement: number, valuePerPx: number): {
        thumbValueAfterIncrementation: number;
        theLastIncrement: number;
        currentIntervalInfo: {
            keyOfInfimum: string;
            keyOfSupremum: string;
            magnificationFactor: number;
            step: number | 'none';
        };
    };
    protected static _toThumbSteppedIncrementation(thumbIncrementationOfLastInterval: number, step: number | 'none'): {
        stepped: number;
        remains: number;
    };
    protected _thumbValueToPositionOnTrack(thumbIndex: number): {
        offsetInPercent: number;
        THUMB_SCALE_FACTOR: number;
        THUMB_TO_CENTER_OFFSET: number;
    };
    protected _trackEventListenerObject: {
        cache: {
            trackElem: HTMLElement;
        };
        handleEvent: (event: Event) => void;
        _onClick: (event: MouseEvent) => void;
    };
    protected _getNearestThumb(value: number): number;
    protected _pipsEventListenerObject: {
        handleEvent: (event: Event) => void;
        _onClick: (event: MouseEvent) => void;
    };
}
export { RangeSliderView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
