import { TemplateResult } from 'lit-html';
import { MVPView } from "../../../utils/devTools/scripts/PluginCreationHelper";
import './range-slider__track.scss';
import IRangeSliderTrackView, { TrackOptions, FixedTrackOptions, TrackState } from './range-slider__track.view.coupling';
declare const DEFAULT_OPTIONS: FixedTrackOptions;
declare const DEFAULT_STATE: TrackState;
declare class RangeSliderTrackView extends MVPView<FixedTrackOptions, TrackOptions, TrackState> implements IRangeSliderTrackView {
    static intervalsKeysCompareFunc(a: string, b: string): number;
    readonly template: ({ classInfo, styleInfo, attributes }?: {
        classInfo?: {} | undefined;
        styleInfo?: {} | undefined;
        attributes?: {} | undefined;
    }, innerHTML?: TemplateResult | TemplateResult[]) => TemplateResult;
    constructor(options?: TrackOptions, state?: TrackState);
    getOrientationOption(): "horizontal" | "vertical";
    getIntervalsOption(): {
        [x: string]: number;
        min: number;
        max: number;
    };
    getStepsOption(): (number | "none")[];
    getPaddingOption(): [number, number];
    setOrientationOption(orientation?: TrackOptions['orientation']): this;
    setIntervalsOption(intervals?: TrackOptions['intervals']): this;
    setStepsOption(steps?: TrackOptions['steps']): this;
    setPaddingOption(padding?: TrackOptions['padding']): this;
    protected _fixIntervalsOption(): this;
    protected _fixOrderOfIntervalsOption(): this;
    protected _fixKeysOfIntervalsOption(): this;
    protected _fixValuesOfIntervalsOption(): this;
    protected _fixStepsOption(): this;
    protected _fixLengthOfStepsOption(): this;
    protected _fixValuesOfStepsOption(): void;
    protected _fixPaddingOption(): this;
    protected _getSortedKeysOfIntervalsOption(): string[];
}
export { RangeSliderTrackView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
