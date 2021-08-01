import { MVPView } from "../../../utils/devTools/scripts/PluginCreationHelper";
declare type TrackOptions = {
    orientation?: 'horizontal' | 'vertical';
    intervals?: {
        min: number;
        max: number;
        [key: string]: number;
    };
    steps?: 'none' | number | ('none' | number)[];
    padding?: number | [number, number];
};
declare type FixedTrackOptions = {
    orientation: Required<TrackOptions>['orientation'];
    intervals: Required<TrackOptions>['intervals'];
    steps: ('none' | number)[];
    padding: [number, number];
};
declare type TrackState = {};
interface IRangeSliderTrackView extends MVPView<FixedTrackOptions, TrackOptions, TrackState> {
    getIntervalsOption(): FixedTrackOptions['intervals'];
    getStepsOption(): FixedTrackOptions['steps'];
    getPaddingOption(): FixedTrackOptions['padding'];
    setIntervalsOption(intervals?: TrackOptions['intervals']): this;
    setStepsOption(steps?: TrackOptions['steps']): this;
    setPaddingOption(padding?: TrackOptions['padding']): this;
}
export { IRangeSliderTrackView as default, TrackOptions, FixedTrackOptions, TrackState };
