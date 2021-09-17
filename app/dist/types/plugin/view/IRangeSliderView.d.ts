import { MVPView } from "../../utils/devTools/scripts/PluginCreationHelper";
import { TrackOptions, FixedTrackOptions } from './components/TrackView/ITrackView';
import { RangeOptions } from './components/RangeView/IRangeView';
import { TooltipOptions } from './components/TooltipView/ITooltipView';
import { PipsOptions } from './components/PipsView/IPipsView';
declare type Formatter = (value: number) => string;
declare type Mode = 'intervals' | 'count' | 'positions' | 'values';
declare type RangeSliderOptions = {
    intervals?: TrackOptions['intervals'];
    start?: number | number[];
    steps?: TrackOptions['steps'];
    connect?: NonNullable<RangeOptions['isConnected']> | Required<RangeOptions>['isConnected'][];
    orientation?: 'horizontal' | 'vertical';
    padding?: TrackOptions['padding'];
    formatter?: Formatter;
    tooltips?: boolean | (NonNullable<TooltipOptions['formatter']> | boolean)[];
    pips?: Omit<PipsOptions, 'formatter' | 'values' | 'orientation'> & {
        mode?: Mode;
        values?: number | number[];
    };
};
declare type FixedRangeSliderOptions = {
    intervals: Required<RangeSliderOptions>['intervals'];
    start: number[];
    steps: FixedTrackOptions['steps'];
    connect: Required<RangeOptions>['isConnected'][];
    orientation: Required<RangeSliderOptions>['orientation'];
    padding: FixedTrackOptions['padding'];
    formatter: Required<RangeSliderOptions>['formatter'];
    tooltips: (Required<TooltipOptions>['formatter'] | boolean)[];
    pips: NonNullable<Required<RangeSliderOptions['pips']>>;
};
declare type RangeSliderState = {
    value: FixedRangeSliderOptions['start'];
    isActiveThumbs: boolean[];
};
interface IRangeSliderView extends MVPView<FixedRangeSliderOptions, RangeSliderOptions, RangeSliderState, 'start' | 'slide' | 'update' | 'change' | 'set' | 'end'> {
    getIntervalsOption(): FixedRangeSliderOptions['intervals'];
    getStartOption(): FixedRangeSliderOptions['start'];
    getStepsOption(): FixedRangeSliderOptions['steps'];
    getConnectOption(): FixedRangeSliderOptions['connect'];
    getOrientationOption(): FixedRangeSliderOptions['orientation'];
    getPaddingOption(): FixedRangeSliderOptions['padding'];
    getFormatterOption(): FixedRangeSliderOptions['formatter'];
    getTooltipsOption(): FixedRangeSliderOptions['tooltips'];
    getPipsOption(): FixedRangeSliderOptions['pips'];
    setIntervalsOption(intervals?: RangeSliderOptions['intervals']): this;
    setStartOption(start?: RangeSliderOptions['start']): this;
    setStepsOption(steps?: RangeSliderOptions['steps']): this;
    setConnectOption(connect?: RangeSliderOptions['connect']): this;
    setOrientationOption(orientation?: RangeSliderOptions['orientation']): this;
    setPaddingOption(padding?: RangeSliderOptions['padding']): this;
    setFormatterOption(formatter?: RangeSliderOptions['formatter']): this;
    setTooltipsOption(tooltips?: RangeSliderOptions['tooltips']): this;
    setPipsOption(pips?: RangeSliderOptions['pips']): this;
    get(): FixedRangeSliderOptions['start'];
    set(value?: RangeSliderOptions['start']): this;
}
export { IRangeSliderView as default, Formatter, Mode, RangeSliderOptions, FixedRangeSliderOptions, RangeSliderState, };
