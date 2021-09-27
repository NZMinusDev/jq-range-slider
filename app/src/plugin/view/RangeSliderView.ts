import defaultsDeep from 'lodash-es/defaultsDeep';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';
import { spread } from '@open-wc/lit-helpers';

import { handleEvent } from '@utils/devTools/scripts/view/ComponentCreationHelper';
import { MVPView } from '@utils/devTools/scripts/view/MVPHelper';
import { ascending } from '@utils/devTools/scripts/ProcessingOfPrimitiveDataHelper';
import { fixLength } from '@utils/devTools/scripts/ArrayHelper';

import {
  FixedTrackOptions,
  TrackOptions,
} from './components/TrackView/ITrackView';
import { RangeOptions } from './components/RangeView/IRangeView';
import { ThumbOptions, ThumbState } from './components/ThumbView/IThumbView';
import {
  TooltipOptions,
  TooltipState,
} from './components/TooltipView/ITooltipView';
import { PipsOptions } from './components/PipsView/IPipsView';
import TrackView, {
  DEFAULT_OPTIONS as TRACK_DEFAULT_OPTIONS,
} from './components/TrackView/TrackView';
import RangeView, {
  DEFAULT_OPTIONS as RANGE_DEFAULT_OPTIONS,
} from './components/RangeView/RangeView';
import ThumbView from './components/ThumbView/ThumbView';
import TooltipView from './components/TooltipView/TooltipView';
import PipsView, {
  DEFAULT_OPTIONS as PIPS_DEFAULT_OPTIONS,
} from './components/PipsView/PipsView';
import IRangeSliderView, {
  RangeSliderOptions,
  FixedRangeSliderOptions,
  RangeSliderState,
} from './IRangeSliderView';
import './RangeSliderView.scss';

const DEFAULT_OPTIONS: FixedRangeSliderOptions = {
  intervals: TRACK_DEFAULT_OPTIONS.intervals,
  start: [0],
  steps: TRACK_DEFAULT_OPTIONS.steps,
  connect: [
    RANGE_DEFAULT_OPTIONS.isConnected,
    RANGE_DEFAULT_OPTIONS.isConnected,
  ],
  orientation: 'horizontal',
  padding: TRACK_DEFAULT_OPTIONS.padding,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
  tooltips: [true],
  pips: {
    mode: 'intervals',
    values: Object.values(TRACK_DEFAULT_OPTIONS.intervals),
    density: PIPS_DEFAULT_OPTIONS.density,
    isHidden: PIPS_DEFAULT_OPTIONS.isHidden,
  },
};

const DEFAULT_STATE: RangeSliderState = {
  value: DEFAULT_OPTIONS.start,
  isActiveThumbs: new Array(DEFAULT_OPTIONS.start.length).fill(false),
};

const thumbSelector = '.js-range-slider__thumb-origin';

class RangeSliderView
  extends MVPView<
    FixedRangeSliderOptions,
    RangeSliderOptions,
    RangeSliderState,
    'start' | 'slide' | 'update' | 'change' | 'set' | 'end'
  >
  implements IRangeSliderView
{
  readonly template = ({
    classInfo = {},
    styleInfo = {},
    attributes = {},
  } = {}) => html`<div
    class=${classMap({
      'range-slider': true,
      [`range-slider_orientation_${this._options.orientation}`]: true,
      ...classInfo,
    })}
    ...=${spread(attributes)}
    style=${styleMap({ ...styleInfo })}
  >
    ${new TrackView(this._toTrackOptions()).template(
      { attributes: { '@click': this._trackEventListenerObject } },
      [
        ...this._options.connect
          .map(
            (isConnected, index) => new RangeView(this._toRangeOptions(index))
          )
          .map((rangeView, index) =>
            rangeView.template({
              classInfo: {
                'range-slider__range_animate_tap':
                  (this._state.isActiveThumbs[index] ?? false) ===
                  (this._state.isActiveThumbs[index - 1] ?? false),
              },
              styleInfo: {
                transform: this._getRangeTransform(index),
              },
            })
          ),
        ...this._state.value
          .map(
            (thumbValue, index) =>
              new ThumbView(
                this._toThumbOptions(index),
                this._toThumbState(index)
              )
          )
          .map((thumbView, index) =>
            thumbView.template(
              {
                classInfo: {
                  'range-slider__thumb-origin_animate_tap':
                    !this._state.isActiveThumbs[index],
                },
                styleInfo: {
                  transform: this._getThumbTransform(index),
                  zIndex: this._getThumbZIndex(index),
                },
                attributes: { '@pointerdown': this._thumbEventListenerObject },
              },
              {
                innerHTML: new TooltipView(
                  this._toTooltipOptions(index),
                  this._toTooltipState(index)
                ).template(),
                isActive: this._state.isActiveThumbs[index],
              }
            )
          ),
      ]
    )}
    ${new PipsView(this._toPipsOptions()).template({
      attributes: { '@click': this._pipsEventListenerObject },
    })}
  </div>`;

  constructor(
    options: RangeSliderOptions = DEFAULT_OPTIONS,
    state: RangeSliderState = {
      value: Array.isArray(options.start)
        ? options.start
        : [options.start ?? DEFAULT_STATE.value[0]],
      isActiveThumbs: Array.isArray(options.start)
        ? new Array(options.start.length).fill(false)
        : DEFAULT_STATE.isActiveThumbs,
    }
  ) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: [
        'intervals',
        'padding',
        'start',
        'steps',
        'connect',
        'orientation',
        'formatter',
        'tooltips',
        'pips',
      ],
      theOrderOfIteratingThroughTheState: ['value', 'isActiveThumbs'],
    });
  }

  getIntervalsOption() {
    return { ...this._options.intervals };
  }

  getStartOption() {
    return [...this._options.start];
  }

  getStepsOption() {
    return [...this._options.steps];
  }

  getConnectOption() {
    return [...this._options.connect];
  }

  getOrientationOption() {
    return this._options.orientation;
  }

  getPaddingOption() {
    return [...this._options.padding] as [number, number];
  }

  getFormatterOption() {
    return this._options.formatter;
  }

  getTooltipsOption() {
    return [...this._options.tooltips];
  }

  getPipsOption() {
    return defaultsDeep({}, this._options.pips);
  }

  setIntervalsOption(
    intervals: RangeSliderOptions['intervals'] = DEFAULT_OPTIONS.intervals
  ) {
    this._options.intervals = { ...intervals };

    this._fixIntervalsOption()
      ._fixStartOption()
      ._fixStepsOption()
      ._fixPipsOption()
      ._fixValueState();

    return this;
  }

  setStartOption(start: RangeSliderOptions['start'] = DEFAULT_OPTIONS.start) {
    this._options.start = Array.isArray(start)
      ? [...start]
      : this._options.start.fill(start);

    this._fixStartOption()
      ._fixConnectOption()
      ._fixTooltipsOption()
      ._fixValueState()
      ._fixIsActiveThumbsState();

    return this;
  }

  setStepsOption(steps: RangeSliderOptions['steps'] = DEFAULT_OPTIONS.steps) {
    this._options.steps = Array.isArray(steps)
      ? [...steps]
      : this._options.steps.fill(steps);

    this._fixStepsOption();

    return this;
  }

  setConnectOption(
    connect: RangeSliderOptions['connect'] = DEFAULT_OPTIONS.connect
  ) {
    this._options.connect = Array.isArray(connect)
      ? [...connect]
      : this._options.connect.fill(connect);

    this._fixConnectOption();

    return this;
  }

  setOrientationOption(
    orientation: RangeSliderOptions['orientation'] = DEFAULT_OPTIONS.orientation
  ) {
    this._options.orientation = orientation;

    return this;
  }

  setPaddingOption(
    padding: RangeSliderOptions['padding'] = DEFAULT_OPTIONS.padding
  ) {
    this._options.padding = Array.isArray(padding)
      ? ([...padding] as FixedRangeSliderOptions['padding'])
      : this._options.padding.fill(padding);

    this._fixPaddingOption()._fixStartOption()._fixValueState();

    return this;
  }

  setFormatterOption(
    formatter: RangeSliderOptions['formatter'] = DEFAULT_OPTIONS.formatter
  ) {
    this._options.formatter = formatter;

    this._fixTooltipsOption();

    return this;
  }

  setTooltipsOption(
    tooltips: RangeSliderOptions['tooltips'] = DEFAULT_OPTIONS.tooltips
  ) {
    this._options.tooltips = Array.isArray(tooltips)
      ? [...tooltips]
      : this._options.tooltips.fill(tooltips);

    this._fixTooltipsOption();

    return this;
  }

  setPipsOption(pips: RangeSliderOptions['pips'] = DEFAULT_OPTIONS.pips) {
    this._options.pips = defaultsDeep({}, pips, this._options.pips);

    this._fixPipsOption();

    return this;
  }

  setOptions(options?: RangeSliderOptions) {
    const copy = [...this._state.isActiveThumbs];

    // transition off
    this._state.isActiveThumbs.fill(true);
    super.setOptions(options);
    this._state.isActiveThumbs =
      options?.start !== undefined ? this._state.isActiveThumbs : copy;

    return this;
  }

  get() {
    return [...this._state.value];
  }

  set(value: RangeSliderOptions['start'] = this._options.start) {
    this._setValueState(
      Array.isArray(value) ? [...value] : this._state.value.fill(value)
    );

    this._render();

    this.trigger('update').trigger('set');

    return this;
  }

  protected _setValueState(
    value: RangeSliderState['value'] = DEFAULT_STATE.value
  ) {
    this._state.value = [...value];

    this._fixValueState();

    return this;
  }

  protected _fixIntervalsOption() {
    this._options.intervals = new TrackView({
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      padding: this._options.padding,
      steps: this._options.steps,
    }).getOptions().intervals;

    return this;
  }

  protected _fixPaddingOption() {
    this._options.padding = new TrackView({
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      padding: this._options.padding,
      steps: this._options.steps,
    }).getOptions().padding;

    return this;
  }

  protected _fixStartOption() {
    this._options.start = Array.isArray(this._options.start)
      ? this._options.start
      : [this._options.start];

    if (this._options.start.length < 1) {
      this._options.start = [...DEFAULT_OPTIONS.start];
    }

    const trackBorder = this._getValueBorderOfTrack();
    this._options.start = this._options.start.map((start) => {
      if (start < trackBorder.min) {
        return trackBorder.min;
      }

      if (start > trackBorder.max) {
        return trackBorder.max;
      }

      return start;
    });
    this._options.start.sort(ascending);

    return this;
  }

  protected _fixStepsOption() {
    this._options.steps = new TrackView({
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      padding: this._options.padding,
      steps: this._options.steps,
    }).getOptions().steps;

    return this;
  }

  protected _fixPipsOption() {
    if (!Array.isArray(this._options.pips.values)) {
      this._options.pips.values =
        this._options.pips.values < 1
          ? 0
          : Math.floor(this._options.pips.values);
    }

    this._fixPipsOptionDependOnMode();

    if (Array.isArray(this._options.pips.values)) {
      this._options.pips.values.sort(ascending);
    }

    this._options.pips.density = new PipsView(
      this._toPipsOptions()
    ).getDensityOption();

    return this;
  }

  protected _fixPipsOptionDependOnMode() {
    switch (this._options.pips.mode) {
      case 'intervals': {
        this._fixPipsOptionWithIntervalsMode();

        break;
      }
      case 'count': {
        this._fixPipsOptionWithCountMode();

        break;
      }
      case 'positions': {
        this._fixPipsOptionWithPositionsMode();

        break;
      }
      case 'values': {
        this._fixPipsOptionWithValuesMode();

        break;
      }

      // no default
    }
  }

  protected _fixPipsOptionWithIntervalsMode() {
    this._options.pips.values = Object.values(this._options.intervals);
  }

  protected _fixPipsOptionWithCountMode() {
    this._options.pips.values = Array.isArray(this._options.pips.values)
      ? this._options.pips.values.length
      : this._options.pips.values;
  }

  protected _fixPipsOptionWithPositionsMode() {
    if (Array.isArray(this._options.pips.values)) {
      this._options.pips.values = this._options.pips.values.filter(
        (value) => value >= 0 && value <= 100
      );
    } else {
      const amountOfValues = this._options.pips.values;

      const shiftInPercent = amountOfValues < 1 ? 0 : 100 / amountOfValues;

      let accumulator = -shiftInPercent;
      this._options.pips.values = new Array(amountOfValues + 1)
        .fill(-1)
        .map(() => {
          accumulator += shiftInPercent;

          return accumulator;
        });
    }
  }

  protected _fixPipsOptionWithValuesMode() {
    const valueBorderOfTrack = this._getValueBorderOfTrack();
    this._options.pips.values = Array.isArray(this._options.pips.values)
      ? this._options.pips.values.filter(
          (value) =>
            value >= valueBorderOfTrack.min && value <= valueBorderOfTrack.max
        )
      : [];
  }

  protected _fixConnectOption() {
    const desiredLength = this._options.start.length + 1;

    this._options.connect = Array.isArray(this._options.connect)
      ? this._options.connect
      : new Array(desiredLength).fill(this._options.connect);

    this._options.connect = fixLength(
      this._options.connect,
      desiredLength,
      DEFAULT_OPTIONS.connect[0]
    );

    return this;
  }

  protected _fixTooltipsOption() {
    const desiredLength = this._options.start.length;

    this._options.tooltips = Array.isArray(this._options.tooltips)
      ? this._options.tooltips
      : new Array(desiredLength).fill(this._options.tooltips);

    this._options.tooltips = fixLength(
      this._options.tooltips,
      desiredLength,
      DEFAULT_OPTIONS.tooltips[0]
    );

    return this;
  }

  protected _fixValueState() {
    this._state.value = fixLength(
      this._state.value,
      this._options.start.length,
      NaN
    );
    this._state.value = this._state.value.map((val, index) =>
      Number.isNaN(val) ? this._options.start[index] : val
    );

    const trackBorder = this._getValueBorderOfTrack();
    this._state.value = this._state.value.map((value) => {
      if (value < trackBorder.min) {
        return trackBorder.min;
      }

      if (value > trackBorder.max) {
        return trackBorder.max;
      }

      return value;
    });

    this._state.value.sort(ascending);

    return this;
  }

  protected _fixIsActiveThumbsState() {
    this._state.isActiveThumbs = fixLength(
      this._state.isActiveThumbs,
      this._state.value.length,
      false
    );
  }

  protected _getValueBorderOfTrack() {
    const [leftPad, rightPad] = this._options.padding;

    return {
      min: this._options.intervals.min + leftPad,
      max: this._options.intervals.max - rightPad,
    };
  }

  protected _getLinearPercentBorderOfTrack() {
    const valueBorderOfTrack = this._getValueBorderOfTrack();

    return {
      min: this._toTrackPercent(valueBorderOfTrack.min),
      max: this._toTrackPercent(valueBorderOfTrack.max),
    };
  }

  protected _getIntervalInfoByPoint(
    value: number,
    { isIncludedInSupremum = false } = {}
  ) {
    const intervalsKeys = Object.keys(this._options.intervals).sort(
      TrackView.intervalsKeysCompareFunc
    );

    if (value > this._options.intervals.max) {
      return { keyOfInfimum: 'max' };
    }

    if (value < this._options.intervals.min) {
      return { keyOfSupremum: 'min' };
    }

    let indexOfSupremum = isIncludedInSupremum
      ? intervalsKeys.findIndex((key) => this._options.intervals[key] >= value)
      : intervalsKeys.findIndex((key) => this._options.intervals[key] > value);

    if (value === this._options.intervals.max) {
      indexOfSupremum = intervalsKeys.length - 1;
    }

    const keyOfInfimum = intervalsKeys[indexOfSupremum - 1];
    const keyOfSupremum = intervalsKeys[indexOfSupremum];

    const valueSize =
      this._options.intervals[keyOfSupremum] -
      this._options.intervals[keyOfInfimum];
    const percentSize =
      RangeSliderView._getIntervalKeyAsNumber(keyOfSupremum) -
      RangeSliderView._getIntervalKeyAsNumber(keyOfInfimum);

    const intervalRatio = valueSize / percentSize;
    const fullRatio =
      (this._options.intervals.max - this._options.intervals.min) / 100;

    const magnificationFactor = intervalRatio / fullRatio;

    const step = this._options.steps[indexOfSupremum - 1];

    return {
      keyOfInfimum,
      keyOfSupremum,
      valueSize,
      percentSize,
      magnificationFactor,
      step,
    };
  }

  protected static _getIntervalKeyAsNumber(
    key: keyof Required<TrackOptions>['intervals']
  ) {
    if (key === 'min') {
      return 0;
    }

    if (key === 'max') {
      return 100;
    }

    return Number.parseFloat(`${key}`);
  }

  protected _toTrackPercent(valueOnTrack: number) {
    const intervalsKeys = Object.keys(this._options.intervals).sort(
      TrackView.intervalsKeysCompareFunc
    );

    let offsetInPercent = 0;
    let isStopOffset = false;
    intervalsKeys.forEach((intervalKey, index) => {
      if (!isStopOffset && intervalsKeys[index + 1] !== undefined) {
        const intervalValueSize =
          this._options.intervals[intervalsKeys[index + 1]] -
          this._options.intervals[intervalKey];
        const intervalPercentSize =
          RangeSliderView._getIntervalKeyAsNumber(intervalsKeys[index + 1]) -
          RangeSliderView._getIntervalKeyAsNumber(intervalsKeys[index]);
        const valuePerPercentInInterval =
          intervalValueSize / intervalPercentSize;

        if (
          valueOnTrack >= this._options.intervals[intervalKey] &&
          valueOnTrack < this._options.intervals[intervalsKeys[index + 1]]
        ) {
          offsetInPercent +=
            (valueOnTrack - this._options.intervals[intervalKey]) /
            valuePerPercentInInterval;
          isStopOffset = true;
        } else {
          offsetInPercent += intervalPercentSize;
        }
      }
    });

    return offsetInPercent;
  }

  protected _toTrackValue(linearPercentOnTrack: number) {
    const intervalsKeys = Object.keys(this._options.intervals).sort(
      TrackView.intervalsKeysCompareFunc
    );

    let trackValue = this._options.intervals.min;
    let isStopOffset = false;
    intervalsKeys.forEach((intervalKey, index) => {
      if (!isStopOffset && intervalsKeys[index + 1] !== undefined) {
        const intervalValueSize =
          this._options.intervals[intervalsKeys[index + 1]] -
          this._options.intervals[intervalKey];
        const intervalPercentSize =
          RangeSliderView._getIntervalKeyAsNumber(intervalsKeys[index + 1]) -
          RangeSliderView._getIntervalKeyAsNumber(intervalsKeys[index]);
        const valuePerPercentInInterval =
          intervalValueSize / intervalPercentSize;

        if (
          linearPercentOnTrack >=
            RangeSliderView._getIntervalKeyAsNumber(intervalKey) &&
          linearPercentOnTrack <
            RangeSliderView._getIntervalKeyAsNumber(intervalsKeys[index + 1])
        ) {
          trackValue +=
            (linearPercentOnTrack -
              RangeSliderView._getIntervalKeyAsNumber(intervalKey)) *
            valuePerPercentInInterval;
          isStopOffset = true;
        } else {
          trackValue += intervalPercentSize * valuePerPercentInInterval;
        }
      }
    });

    return trackValue;
  }

  protected _toTrackOptions(): FixedTrackOptions {
    return {
      orientation: this._options.orientation,
      intervals: this._options.intervals,
      steps: this._options.steps,
      padding: this._options.padding,
    };
  }

  protected _toRangeOptions(index: number): Required<RangeOptions> {
    return { isConnected: this._options.connect[index] };
  }

  protected _toThumbOptions(index: number): Required<ThumbOptions> {
    return { start: this._options.start[index] };
  }

  protected _toTooltipOptions(index: number): Required<TooltipOptions> {
    const tooltip = this._options.tooltips[index];

    return {
      orientation: this._options.orientation === 'horizontal' ? 'top' : 'left',
      formatter:
        typeof tooltip === 'boolean' ? this._options.formatter : tooltip,
      isHidden: !tooltip,
    };
  }

  protected _toPipsOptions(): Required<PipsOptions> {
    const { formatter } = this._options;
    const { isHidden, density } = this._options.pips;
    const values = Array.isArray(this._options.pips.values)
      ? [...this._options.pips.values]
      : [];

    const valueBorderOfTrack = this._getValueBorderOfTrack();

    let pipsValues: NonNullable<PipsOptions['values']> = [];

    switch (this._options.pips.mode) {
      case 'intervals': {
        const [leftPad, rightPad] = this._options.padding;

        const minPercent = this._toTrackPercent(
          this._options.intervals.min + leftPad
        );
        const manPercent = this._toTrackPercent(
          this._options.intervals.max - rightPad
        );

        values[0] = valueBorderOfTrack.min;
        values[values.length - 1] = valueBorderOfTrack.max;

        const lastIndex = values.length - 1;
        let percent: number;
        values.forEach((value, index) => {
          if (index === 0) {
            percent = minPercent;
          } else if (index === lastIndex) {
            percent = manPercent;
          } else {
            percent = this._toTrackPercent(value);
          }

          pipsValues.push({ percent, value });
        });

        break;
      }
      case 'count': {
        const amountOfPipsValues = this._options.pips.values as number;

        if (amountOfPipsValues > 0) {
          const shift =
            (valueBorderOfTrack.max - valueBorderOfTrack.min) /
            (amountOfPipsValues - 1);

          let value = valueBorderOfTrack.min;
          pipsValues = new Array(amountOfPipsValues)
            .fill({ percent: NaN, value: NaN })
            .map(() => {
              const pip = { percent: this._toTrackPercent(value), value };

              value += shift;

              return pip;
            });
        }

        break;
      }
      case 'positions': {
        const perPercent =
          (valueBorderOfTrack.max - valueBorderOfTrack.min) / 100;
        pipsValues = values.map((value) => {
          const positionValue =
            value * perPercent - Math.abs(valueBorderOfTrack.min);

          return {
            percent: this._toTrackPercent(positionValue),
            value: positionValue,
          };
        });

        break;
      }
      case 'values': {
        pipsValues = values.map((value) => ({
          percent: this._toTrackPercent(value),
          value,
        }));

        break;
      }

      // no default
    }

    return {
      orientation: this._options.orientation,
      isHidden,
      values: pipsValues,
      density,
      formatter,
    };
  }

  protected _toThumbState(index: number): ThumbState {
    const tooltipOptions = this._toTooltipOptions(index);

    const values = this._state.value;
    const value = values[index];
    const trackBorder = this._getValueBorderOfTrack();

    return {
      ariaOrientation: this._options.orientation,
      ariaValueMin: values[index - 1] ?? trackBorder.min,
      ariaValueMax: values[index + 1] ?? trackBorder.max,
      ariaValueNow: value,
      ariaValueText: tooltipOptions.formatter(value),
    };
  }

  protected _toTooltipState(index: number): TooltipState {
    return {
      value: this._state.value[index],
    };
  }

  protected _getRangeTransform(index: number) {
    const lowerOffset =
      index && this._thumbValueToPositionOnTrack(index - 1).offsetInPercent;
    const greaterOffset =
      this._thumbValueToPositionOnTrack(index).offsetInPercent;

    return this._options.orientation === 'horizontal'
      ? `translate(${lowerOffset}%, 0) scale(${
          (greaterOffset - lowerOffset) / 100
        }, 1)`
      : `translate(0, ${lowerOffset}%) scale(1, ${
          (greaterOffset - lowerOffset) / 100
        })`;
  }

  protected _getThumbTransform(index: number) {
    const thumbOffset = this._thumbValueToPositionOnTrack(index);
    const thumbTranslate =
      thumbOffset.offsetInPercent * thumbOffset.thumbScaleFactor -
      thumbOffset.thumbToCenterOffset;

    return this._options.orientation === 'horizontal'
      ? `translate(${thumbTranslate}%, 0)`
      : `translate(0, ${thumbTranslate}%)`;
  }

  protected _getThumbZIndex(index: number) {
    const baseZ = 2;
    const nextIndex = index + 1;
    const previousIndex = index - 1;
    const epsilon =
      (this._options.intervals.max - this._options.intervals.min) * 0.02;
    const trackBorder = this._getValueBorderOfTrack();
    const infimum = this._state.value[previousIndex] ?? trackBorder.min;
    const supremum = this._state.value[nextIndex] ?? trackBorder.max;

    return this._state.value[index] >= supremum - epsilon &&
      this._state.value[index] >= infimum + epsilon
      ? `${baseZ + 2 * this._state.value.length - index - 2}`
      : `${baseZ + index}`;
  }

  protected _thumbEventListenerObject = {
    cache: new WeakMap() as WeakMap<
      HTMLElement,
      ReturnType<RangeSliderView['_initThumbCache']>
    >,

    handleEvent: (event: Event) => {
      const origin = this._thumbEventListenerObject.getOrigin(event);

      this._thumbEventListenerObject.cache.set(
        origin,
        this._initThumbCache(origin)
      );

      handleEvent.apply(this._thumbEventListenerObject, [event, 'thumb']);
    },

    handleThumbPointerdown: (event: PointerEvent) => {
      const origin = this._thumbEventListenerObject.getOrigin(event);

      const cache = this._thumbEventListenerObject.cache.get(
        origin
      ) as ReturnType<RangeSliderView['_initThumbCache']>;

      origin.setPointerCapture(event.pointerId);

      this._state.isActiveThumbs[cache.thumbIndex] = true;

      this.trigger('start');

      origin.addEventListener(
        'pointermove',
        this._thumbEventListenerObject.handleThumbPointermove
      );
      origin.addEventListener(
        'lostpointercapture',
        this._thumbEventListenerObject.handleThumbLostpointercapture,
        { once: true }
      );
    },
    handleThumbPointermove: (event: PointerEvent) => {
      if (
        this._options.orientation === 'horizontal'
          ? event.movementX === 0
          : event.movementY === 0
      ) {
        return;
      }

      const origin = this._thumbEventListenerObject.getOrigin(event);
      const thumb = origin.querySelector(
        '.js-range-slider__thumb'
      ) as HTMLDivElement;

      const cache = this._thumbEventListenerObject.cache.get(
        origin
      ) as ReturnType<RangeSliderView['_initThumbCache']>;

      if (
        this._isMoveFromExteriorOfThumb(thumb.getBoundingClientRect(), event)
      ) {
        return;
      }

      let thumbValue = this._state.value[cache.thumbIndex];
      const currentIntervalInfo = this._getIntervalInfoByPoint(thumbValue) as {
        keyOfInfimum: string;
        keyOfSupremum: string;
        valueSize: number;
        percentSize: number;
        magnificationFactor: number;
        step: number | 'none';
      };

      const trackBorder = this._getValueBorderOfTrack();
      const ariaValueMin =
        this._state.value[cache.thumbIndex - 1] ?? trackBorder.min;
      const ariaValueMax =
        this._state.value[cache.thumbIndex + 1] ?? trackBorder.max;

      const currentMovement =
        this._options.orientation === 'horizontal'
          ? event.movementX
          : event.movementY;
      cache.movementAcc += currentMovement;

      const thumbValueIncrementation =
        (cache.movementAcc / window.devicePixelRatio) *
        cache.valuePerPx *
        currentIntervalInfo.magnificationFactor;
      thumbValue += thumbValueIncrementation;

      const shiftThroughIntervals = this._fixNonLinearShiftThroughIntervals(
        currentIntervalInfo,
        thumbValue,
        thumbValueIncrementation,
        cache.movementAcc,
        cache.valuePerPx
      );

      if (currentIntervalInfo.step !== 'none') {
        const steppedIncrementation =
          RangeSliderView._toThumbSteppedIncrementation(
            shiftThroughIntervals.theLastIncrement,
            shiftThroughIntervals.currentIntervalInfo.step
          );

        thumbValue =
          shiftThroughIntervals.thumbValueAfterIncrementation -
          shiftThroughIntervals.theLastIncrement;

        if (Math.abs(steppedIncrementation.stepped) > 0) {
          thumbValue += steppedIncrementation.stepped;

          const remainsFactor =
            steppedIncrementation.remains /
            shiftThroughIntervals.theLastIncrement;
          cache.movementAcc *= remainsFactor;
        }
      } else {
        thumbValue = shiftThroughIntervals.thumbValueAfterIncrementation;
        cache.movementAcc = 0;
      }

      if (thumbValue <= ariaValueMin) {
        thumbValue = ariaValueMin;
      } else if (thumbValue >= ariaValueMax) {
        thumbValue = ariaValueMax;
      }

      this._state.value[cache.thumbIndex] = thumbValue;
      this._setState({});

      this.trigger('slide').trigger('update');
    },
    handleThumbLostpointercapture: (event: PointerEvent) => {
      const origin = this._thumbEventListenerObject.getOrigin(event);

      const cache = this._thumbEventListenerObject.cache.get(
        origin
      ) as ReturnType<RangeSliderView['_initThumbCache']>;

      origin.removeEventListener(
        'pointermove',
        this._thumbEventListenerObject.handleThumbPointermove
      );
      this._state.isActiveThumbs[cache.thumbIndex] = false;
      cache.movementAcc = 0;
      this._setState({});
      this.trigger('change').trigger('set').trigger('end');
    },

    getOrigin(event: Event) {
      return (event.target as HTMLElement).closest(
        thumbSelector
      ) as HTMLElement;
    },
  };

  protected _initThumbCache(origin: HTMLElement) {
    const trackElem = origin.closest('.js-range-slider__track') as HTMLElement;
    const ranges = trackElem.querySelectorAll<HTMLElement>(
      '.js-range-slider__range'
    );

    const trackValueSize =
      this._options.intervals.max - this._options.intervals.min;
    const thumbIndex = Array.from(
      trackElem.querySelectorAll<HTMLElement>(thumbSelector)
    ).indexOf(origin);
    const siblingRanges = [
      ranges.item(thumbIndex),
      ranges.item(thumbIndex + 1),
    ] as [HTMLElement, HTMLElement];
    const valuePerPx =
      this._options.orientation === 'horizontal'
        ? trackValueSize / trackElem.getBoundingClientRect().width
        : trackValueSize / trackElem.getBoundingClientRect().height;

    return {
      trackElem,
      thumbIndex,
      trackValueSize,
      siblingRanges,
      valuePerPx,
      movementAcc: 0,
    };
  }

  protected _isMoveFromExteriorOfThumb(
    thumbDOMRect: DOMRect,
    event: PointerEvent
  ) {
    let isCursorMore: boolean;
    let isCursorLess: boolean;
    let isReverseMovement: boolean;

    if (this._options.orientation === 'horizontal') {
      isCursorMore = event.clientX > thumbDOMRect.right;
      isCursorLess = event.clientX < thumbDOMRect.left;

      if (isCursorMore) {
        isReverseMovement = event.movementX < 0;
      } else if (isCursorLess) {
        isReverseMovement = event.movementX > 0;
      } else {
        isReverseMovement = false;
      }
    } else {
      isCursorMore = event.clientY > thumbDOMRect.bottom;
      isCursorLess = event.clientY < thumbDOMRect.top;

      if (isCursorMore) {
        isReverseMovement = event.movementY < 0;
      } else if (isCursorLess) {
        isReverseMovement = event.movementY > 0;
      } else {
        isReverseMovement = false;
      }
    }

    const isNotOnTrack = isCursorMore || isCursorLess;

    return isNotOnTrack && isReverseMovement;
  }

  protected _fixNonLinearShiftThroughIntervals(
    currentIntervalInfo: {
      keyOfInfimum: string;
      keyOfSupremum: string;
      magnificationFactor: number;
      step: number | 'none';
    },
    thumbValueAfterIncrementation: number,
    thumbValueIncrementation: number,
    movement: number,
    valuePerPx: number
  ): {
    thumbValueAfterIncrementation: number;
    theLastIncrement: number;
    currentIntervalInfo: {
      keyOfInfimum: string;
      keyOfSupremum: string;
      magnificationFactor: number;
      step: number | 'none';
    };
  } {
    const isMoreThanSupremum =
      currentIntervalInfo.keyOfSupremum !== undefined &&
      thumbValueAfterIncrementation >
        this._options.intervals[currentIntervalInfo.keyOfSupremum];
    const isLessThanInfimum =
      currentIntervalInfo.keyOfInfimum !== undefined &&
      thumbValueAfterIncrementation <
        this._options.intervals[currentIntervalInfo.keyOfInfimum];
    const keyOfCrossedInterval = isMoreThanSupremum
      ? currentIntervalInfo.keyOfSupremum
      : currentIntervalInfo.keyOfInfimum;

    const shouldFix = isMoreThanSupremum || isLessThanInfimum;
    const isEnd =
      keyOfCrossedInterval === 'max' || keyOfCrossedInterval === 'min';

    if (shouldFix && !isEnd) {
      const thumbValueBeforeIncrementation =
        thumbValueAfterIncrementation - thumbValueIncrementation;

      const complementToWholeIntervalValue =
        this._options.intervals[keyOfCrossedInterval] -
        thumbValueBeforeIncrementation;

      const toWholeIntervalFactor =
        complementToWholeIntervalValue / thumbValueIncrementation;
      const toNewValueFactor = 1 - toWholeIntervalFactor;

      const nextIntervalInfo = this._getIntervalInfoByPoint(
        this._options.intervals[keyOfCrossedInterval],
        { isIncludedInSupremum: isLessThanInfimum }
      ) as {
        keyOfInfimum: string;
        keyOfSupremum: string;
        magnificationFactor: number;
        step: number | 'none';
      };

      const correctedThumbValueIncrementation =
        (movement / window.devicePixelRatio) *
        valuePerPx *
        (toWholeIntervalFactor * currentIntervalInfo.magnificationFactor +
          toNewValueFactor * nextIntervalInfo.magnificationFactor);

      const remainingThumbValueAfterIncrementation =
        thumbValueBeforeIncrementation + correctedThumbValueIncrementation;

      const remainingThumbValueIncrementation =
        remainingThumbValueAfterIncrementation -
        this._options.intervals[keyOfCrossedInterval];
      const remainingMovement = movement - movement * toWholeIntervalFactor;

      return this._fixNonLinearShiftThroughIntervals(
        nextIntervalInfo,
        remainingThumbValueAfterIncrementation,
        remainingThumbValueIncrementation,
        remainingMovement,
        valuePerPx
      );
    }

    return {
      thumbValueAfterIncrementation,
      theLastIncrement: thumbValueIncrementation,
      currentIntervalInfo,
    };
  }

  protected static _toThumbSteppedIncrementation(
    thumbIncrementationOfLastInterval: number,
    step: number | 'none'
  ) {
    if (step === 'none') {
      return { stepped: thumbIncrementationOfLastInterval, remains: 0 };
    }

    const signFactor = thumbIncrementationOfLastInterval >= 0 ? 1 : -1;
    const stepped =
      signFactor *
      Math.floor(Math.abs(thumbIncrementationOfLastInterval) / step) *
      step;
    const remains = thumbIncrementationOfLastInterval - stepped;

    return { stepped, remains };
  }

  protected _thumbValueToPositionOnTrack(thumbIndex: number) {
    const trackRelativeSizeInPercent = 100;
    const originThumbRelativeSizeInPercent = 10;
    const thumbScaleFactor =
      trackRelativeSizeInPercent / originThumbRelativeSizeInPercent;

    const thumbToCenterOffset = 50;

    const offsetInPercent = this._toTrackPercent(this._state.value[thumbIndex]);

    return { offsetInPercent, thumbScaleFactor, thumbToCenterOffset };
  }

  protected _trackEventListenerObject = {
    cache: {} as { trackElem: HTMLElement },

    handleEvent: (event: Event) => {
      if ((event.target as HTMLElement).closest(thumbSelector) !== null) {
        return;
      }

      this._trackEventListenerObject.cache.trackElem = (
        event.target as HTMLElement
      ).closest('.js-range-slider__track') as HTMLElement;

      handleEvent.apply(this._trackEventListenerObject, [event, 'track']);
    },

    handleTrackClick: (event: MouseEvent) => {
      const trackBoundingClientRect =
        this._trackEventListenerObject.cache.trackElem.getBoundingClientRect();
      const linearPercentTrackBorder = this._getLinearPercentBorderOfTrack();

      let clickedLinearPercent =
        this._options.orientation === 'horizontal'
          ? ((event.clientX - trackBoundingClientRect.left) /
              trackBoundingClientRect.width) *
            100
          : ((event.clientY - trackBoundingClientRect.top) /
              trackBoundingClientRect.height) *
            100;

      if (clickedLinearPercent < linearPercentTrackBorder.min) {
        clickedLinearPercent = linearPercentTrackBorder.min;
      } else if (clickedLinearPercent > linearPercentTrackBorder.max) {
        clickedLinearPercent = linearPercentTrackBorder.max;
      }

      const clickedValue = this._toTrackValue(clickedLinearPercent);

      this._state.value[this._getNearestThumb(clickedValue)] = clickedValue;
      this._setState({});

      this.trigger('slide').trigger('update').trigger('change').trigger('set');
    },
  };

  protected _getNearestThumb(value: number) {
    const distances = this._state.value.map((thumbValue) =>
      Math.abs(thumbValue - value)
    );

    const minDistance = Math.min(...distances);
    const theLeastIndexOfNearestThumb = distances.indexOf(
      Math.min(...distances)
    );
    const nearestValue = this._state.value[theLeastIndexOfNearestThumb];

    return value < nearestValue
      ? theLeastIndexOfNearestThumb
      : distances.lastIndexOf(minDistance);
  }

  protected _pipsEventListenerObject = {
    handleEvent: (event: Event) => {
      handleEvent.apply(this._pipsEventListenerObject, [event, 'pips']);
    },

    handlePipsClick: (event: MouseEvent) => {
      const pipValueElem = (event.target as HTMLElement).closest(
        '.js-range-slider__pips-value'
      ) as HTMLElement;

      if (pipValueElem === null) {
        return;
      }

      const pipValue = pipValueElem.dataset.value as string;

      this._state.value[this._getNearestThumb(Number(pipValue))] =
        Number(pipValue);
      this._setState({});

      this.trigger('slide').trigger('update').trigger('change').trigger('set');
    },
  };
}

export { RangeSliderView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
