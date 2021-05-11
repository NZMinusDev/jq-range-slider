import "./range-slider__track.scss";
import IRangeSliderTrackView, { TrackOptions, FixedTrackOptions, TrackState } from "./range-slider__track.view.coupling";
import { TemplateResult } from "lit-html";
import { MVPView } from "../../../../../../utils/devTools/tools/PluginCreationHelper";
export declare const DEFAULT_OPTIONS: FixedTrackOptions;
export declare const DEFAULT_STATE: TrackState;
export default class RangeSliderTrackView extends MVPView<FixedTrackOptions, TrackOptions, TrackState> implements IRangeSliderTrackView {
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
    setOrientationOption(orientation?: TrackOptions["orientation"]): this;
    setIntervalsOption(intervals?: TrackOptions["intervals"]): this;
    setStepsOption(steps?: TrackOptions["steps"]): this;
    setPaddingOption(padding?: TrackOptions["padding"]): this;
    protected _fixIntervalsOption(): this;
    protected _fixStepsOption(): this;
    protected _fixPaddingOption(): this;
    protected _getSortedKeysOfIntervalsOption(): string[];
}
export declare const intervalsKeysCompareFunc: (a: any, b: any) => number;
