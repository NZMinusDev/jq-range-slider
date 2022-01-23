import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';
import { spread } from '@open-wc/lit-helpers';

import handleEvent from '@shared/utils/scripts/components/creation/handleEvent';

import { TrackViewOptions } from './components/TrackView/types';
import { RangeViewOptions } from './components/RangeView/types';
import { ThumbViewState } from './components/ThumbView/types';
import {
  TooltipViewOptions,
  TooltipViewState,
} from './components/TooltipView/types';
import {
  PipsViewOptions,
  PipsViewDOMEvents,
} from './components/PipsView/types';
import TrackView from './components/TrackView/TrackView';
import RangeView from './components/RangeView/RangeView';
import ThumbView from './components/ThumbView/ThumbView';
import TooltipView from './components/TooltipView/TooltipView';
import PipsView from './components/PipsView/PipsView';
import { RangeSliderViewOptions } from './types';
import RangeSliderAbstractView from './RangeSliderAbstractView';
import './RangeSliderView.scss';

const trackSelector = '.js-range-slider__track';
const thumbOriginSelector = '.js-range-slider__thumb-origin';
const thumbSelector = '.js-range-slider__thumb';
const pipsSelector = '.js-range-slider__pips-value';

class RangeSliderView extends RangeSliderAbstractView {
  readonly template = ({
    classInfo = {},
    styleInfo = {},
    attributes = {},
  } = {}) => html`<div
    class=${classMap({
      'range-slider': true,
      'js-range-slider': true,
      [`range-slider_orientation_${this._options.orientation}`]: true,
      ...classInfo,
    })}
    ...=${spread(attributes)}
    style=${styleMap({ ...styleInfo })}
  >
    ${new TrackView(this._toTrackViewOptions(), {}).template(
      { attributes: { '@click': this._trackEventListenerObject } },
      [
        ...this._options.connect.map((isConnected, index) =>
          new RangeView(this._toRangeViewOptions(index), {}).template({
            classInfo: {
              'range-slider__range_animate_tap':
                (this._state.thumbs[index]?.isActive ?? false) ===
                (this._state.thumbs[index - 1]?.isActive ?? false),
            },
            styleInfo: {
              transform: this._getRangeTransform(index),
            },
          })
        ),
        ...this._state.value.map((thumbValue, index) =>
          new ThumbView({}, this._toThumbViewState(index)).template(
            {
              classInfo: {
                'range-slider__thumb-origin_animate_tap':
                  !this._state.thumbs[index].isActive,
              },
              styleInfo: {
                transform: this._getThumbTransform(index),
                zIndex: this._getThumbZIndex(index),
              },
              attributes: { '@pointerdown': this._thumbEventListenerObject },
            },
            {
              innerHTML: new TooltipView(
                this._toTooltipViewOptions(index),
                this._toTooltipViewState(index)
              ).template(),
              isActive: this._state.thumbs[index].isActive,
            }
          )
        ),
      ]
    )}
    ${new PipsView(this._toPipsViewOptions(), {}).template({
      attributes: { '@click': this._pipsEventListenerObject },
    })}
  </div>`;

  protected static _getIntervalKeyAsNumber(
    key: keyof Required<RangeSliderViewOptions>['intervals']
  ) {
    if (key === 'min') {
      return 0;
    }

    if (key === 'max') {
      return 100;
    }

    return Number.parseFloat(`${key}`);
  }

  protected static _findNewSteppedValue(
    currentValue: number,
    newValue: number,
    stepValue: number,
    nextStepValue: number
  ) {
    const sign = newValue >= currentValue ? 1 : -1;

    if (sign === 1) {
      return newValue === nextStepValue ? nextStepValue : stepValue;
    }

    const isNewValueOnTheFirstStep = newValue === stepValue;

    return isNewValueOnTheFirstStep ? stepValue : nextStepValue;
  }

  protected static _findNearestSteppedValue(
    newValue: number,
    stepValue: number,
    nextStepValue: number
  ) {
    const rangeFromFirst = newValue - stepValue;
    const rangeFromSecond = nextStepValue - newValue;

    return rangeFromFirst < rangeFromSecond ? stepValue : nextStepValue;
  }

  protected _toTrackViewOptions(): TrackViewOptions {
    return {
      orientation: this._options.orientation,
    };
  }

  protected _toRangeViewOptions(index: number): RangeViewOptions {
    return { isConnected: this._options.connect[index] };
  }

  protected _toTooltipViewOptions(index: number): TooltipViewOptions {
    const tooltip = this._options.tooltips[index];

    return {
      orientation: this._options.orientation === 'horizontal' ? 'top' : 'left',
      formatter:
        typeof tooltip === 'boolean' ? this._options.formatter : tooltip,
      isHidden: !tooltip,
    };
  }

  protected _toPipsViewOptions(): PipsViewOptions {
    const { orientation, formatter } = this._options;
    const { isHidden, density } = this._options.pips;
    const values = this._toPipsViewValuesOption();

    return {
      orientation,
      isHidden,
      values,
      density,
      formatter,
    };
  }

  protected _toPipsViewValuesOption() {
    const values = Array.isArray(this._options.pips.values)
      ? [...this._options.pips.values]
      : [];
    const { min, max } = this._getValueBorder();

    let pipsValues: PipsViewOptions['values'] = [];

    switch (this._options.pips.mode) {
      case 'intervals': {
        values[0] = min;
        values[values.length - 1] = max;

        pipsValues = values.reduce((acc, value) => {
          const percent = this._toPercent(value);

          return [...acc, { percent, value }];
        }, [] as PipsViewOptions['values']);

        break;
      }
      case 'count': {
        const amountOfPips = this._options.pips.values as number;

        if (amountOfPips > 0) {
          const shift = (max - min) / (amountOfPips - 1);

          let value = min;
          pipsValues = Array.from({ length: amountOfPips }, () => {
            const pip = { percent: this._toPercent(value), value };

            value += shift;

            return pip;
          });
        }

        break;
      }
      case 'positions': {
        const perPercent = (max - min) / 100;
        pipsValues = values.map((value) => {
          const positionValue = value * perPercent - Math.abs(min);

          return {
            percent: this._toPercent(positionValue),
            value: positionValue,
          };
        });

        break;
      }
      case 'values': {
        pipsValues = values.map((value) => ({
          percent: this._toPercent(value),
          value,
        }));

        break;
      }

      // no default
    }

    return pipsValues;
  }

  protected _toThumbViewState(index: number): ThumbViewState {
    const values = this._state.value;
    const value = values[index];
    const { orientation } = this._options;
    const { formatter } = this._toTooltipViewOptions(index);
    const { min, max } = this._getValueBorder();

    return {
      ariaOrientation: orientation,
      ariaValueMin: values[index - 1] ?? min,
      ariaValueMax: values[index + 1] ?? max,
      ariaValueNow: value,
      ariaValueText: formatter(value),
    };
  }

  protected _toTooltipViewState(index: number): TooltipViewState {
    return {
      value: this._state.value[index],
    };
  }

  protected _getRangeTransform(index: number) {
    const lowerOffset = index && this._toPercent(this._state.value[index - 1]);
    const greaterOffset =
      this._state.thumbs.length === index
        ? 100
        : this._toPercent(this._state.value[index]);

    return this._options.orientation === 'horizontal'
      ? `translate(${lowerOffset}%, 0) scale(${
          (greaterOffset - lowerOffset) / 100
        }, 1)`
      : `translate(0, ${lowerOffset}%) scale(1, ${
          (greaterOffset - lowerOffset) / 100
        })`;
  }

  protected _getThumbTransform(index: number) {
    const translate = this._getThumbTranslate(index);

    return this._options.orientation === 'horizontal'
      ? `translate(${translate}%, 0)`
      : `translate(0, ${translate}%)`;
  }

  protected _getThumbTranslate(index: number) {
    const trackRelativeSizeInPercent = 100;
    const originThumbRelativeSizeInPercent = 10;
    const thumbScaleFactor =
      trackRelativeSizeInPercent / originThumbRelativeSizeInPercent;

    const thumbToCenterOffset = 50;

    const offsetInPercent = this._toPercent(this._state.value[index]);

    return offsetInPercent * thumbScaleFactor - thumbToCenterOffset;
  }

  protected _getThumbZIndex(index: number) {
    const trackPercentSize = 100;
    const baseZ = 2;
    const nextIndex = index + 1;
    const previousIndex = index - 1;
    const epsilon = trackPercentSize * 0.02;
    const { min, max } = this._getValueBorder();
    const infimum = this._state.value[previousIndex] ?? min;
    const supremum = this._state.value[nextIndex] ?? max;

    return this._state.value[index] >= supremum - epsilon &&
      this._state.value[index] >= infimum + epsilon
      ? `${baseZ + 2 * this._state.value.length - index - 2}`
      : `${baseZ + index}`;
  }

  protected _thumbEventListenerObject = {
    cache: new WeakMap() as WeakMap<
      HTMLElement,
      {
        trackElem: HTMLElement;
        thumbElem: HTMLDivElement;
        thumbIndex: number;
        offsetPercent?: number | null;
      }
    >,

    handleEvent: (event: Event) => {
      const origin = this._thumbEventListenerObject.getOrigin(event);

      this._thumbEventListenerObject.cache.set(
        origin,
        this._thumbEventListenerObject.initCache(origin)
      );

      handleEvent.apply(this._thumbEventListenerObject, [event, 'thumb']);
    },

    handleThumbPointerdown: (event: PointerEvent) => {
      const origin = this._thumbEventListenerObject.getOrigin(event);
      const cache = this._thumbEventListenerObject.cache.get(origin) as {
        trackElem: HTMLElement;
        thumbElem: HTMLDivElement;
        thumbIndex: number;
        offsetPercent?: number | null;
      };
      const { trackElem, thumbIndex } = cache;
      const currentPercent = this._toPercent(this._state.value[thumbIndex]);
      const cursorPercent = this._getCursorPercentOnTrack(trackElem, event);

      cache.offsetPercent = cursorPercent - currentPercent;
      this._thumbEventListenerObject.cache.set(origin, cache);

      origin.setPointerCapture(event.pointerId);

      origin.addEventListener(
        'pointermove',
        this._thumbEventListenerObject.handleThumbPointermove
      );
      origin.addEventListener(
        'lostpointercapture',
        this._thumbEventListenerObject.handleThumbLostpointercapture,
        { once: true }
      );

      this.trigger('start', { thumbIndex });
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
      const { trackElem, thumbIndex, offsetPercent } =
        this._thumbEventListenerObject.cache.get(origin) as {
          trackElem: HTMLElement;
          thumbElem: HTMLDivElement;
          thumbIndex: number;
          offsetPercent: number;
        };

      const currentPercent = this._toPercent(this._state.value[thumbIndex]);
      const cursorPercent = this._getCursorPercentOnTrack(trackElem, event);
      const newPercent = this._getAllowedThumbMovingPercent(
        cursorPercent - offsetPercent,
        thumbIndex
      );
      const newValue = this._findExactValue(newPercent, {
        findNearest: { currentPercent },
      });

      this.trigger('slide', {
        thumbIndex,
        newValue,
      }).trigger('update', {});
    },
    handleThumbLostpointercapture: (event: PointerEvent) => {
      const origin = this._thumbEventListenerObject.getOrigin(event);
      const cache = this._thumbEventListenerObject.cache.get(origin) as {
        trackElem: HTMLElement;
        thumbElem: HTMLDivElement;
        thumbIndex: number;
        offsetPercent?: number | null;
      };
      const { thumbIndex } = cache;

      cache.offsetPercent = null;
      this._thumbEventListenerObject.cache.set(origin, cache);

      origin.removeEventListener(
        'pointermove',
        this._thumbEventListenerObject.handleThumbPointermove
      );

      this.trigger('change', {})
        .trigger('set', {})
        .trigger('end', { thumbIndex });
    },

    getOrigin(event: Event) {
      return (event.target as HTMLElement).closest(
        thumbOriginSelector
      ) as HTMLElement;
    },

    initCache(origin: HTMLElement) {
      const trackElem = origin.closest(trackSelector) as HTMLElement;
      const thumbElem = origin.querySelector(thumbSelector) as HTMLDivElement;

      const thumbIndex = Array.from(
        trackElem.querySelectorAll<HTMLElement>(thumbOriginSelector)
      ).indexOf(origin);

      return {
        trackElem,
        thumbElem,
        thumbIndex,
      };
    },
  };

  protected _trackEventListenerObject = {
    cache: {} as { trackElem: HTMLElement },

    handleEvent: (event: Event) => {
      if ((event.target as HTMLElement).closest(thumbOriginSelector) !== null) {
        return;
      }

      this._trackEventListenerObject.cache.trackElem = (
        event.target as HTMLElement
      ).closest(trackSelector) as HTMLElement;

      handleEvent.apply(this._trackEventListenerObject, [event, 'track']);
    },

    handleTrackClick: (event: PointerEvent) => {
      const { trackElem } = this._trackEventListenerObject.cache;

      const clickedLinearPercent = this._getCursorPercentOnTrack(
        trackElem,
        event
      );
      const thumbIndex = this._getNearestThumb(clickedLinearPercent);
      const newValue = this._findExactValue(clickedLinearPercent);

      this.trigger('slide', {
        thumbIndex,
        newValue,
      })
        .trigger('update', {})
        .trigger('change', {})
        .trigger('set', {});
    },
  };

  protected _pipsEventListenerObject = {
    cache: {},

    handleEvent: (event: Event) => {
      handleEvent.apply(this._pipsEventListenerObject, [event, 'pips']);
    },

    handlePipsClick: (event: PipsViewDOMEvents['click']) => {
      const pipValueElem = (event.target as HTMLElement).closest(
        pipsSelector
      ) as HTMLElement;

      if (pipValueElem === null) {
        return;
      }

      const { percent: clickedLinearPercent } = event.data;

      const thumbIndex = this._getNearestThumb(clickedLinearPercent);
      const newValue = this._toValue(clickedLinearPercent);

      this.trigger('slide', {
        thumbIndex,
        newValue,
      })
        .trigger('update', {})
        .trigger('change', {})
        .trigger('set', {});
    },
  };

  protected _getCursorPercentOnTrack(
    trackElem: HTMLElement,
    event: PointerEvent
  ) {
    const { left, top, width, height } = trackElem.getBoundingClientRect();

    return this._options.orientation === 'horizontal'
      ? ((event.clientX - left) / width) * 100
      : ((event.clientY - top) / height) * 100;
  }

  protected _getAllowedThumbMovingPercent(
    desiredPercent: number,
    thumbIndex: number
  ) {
    const { min, max } = this._getValueBorder();
    const [leftThumbValue, rightThumbValue] = [
      this._state.value[thumbIndex - 1],
      this._state.value[thumbIndex + 1],
    ];
    const [minPercent, maxPercent] = [
      this._toPercent(leftThumbValue ?? min),
      this._toPercent(rightThumbValue ?? max),
    ];

    if (desiredPercent < minPercent) {
      return minPercent;
    }

    if (desiredPercent > maxPercent) {
      return maxPercent;
    }

    return desiredPercent;
  }

  protected _getNearestThumb(linearPercent: number) {
    const positions = this._state.value.map((val) => this._toPercent(val));

    const distances = positions.map((position) =>
      Math.abs(position - linearPercent)
    );

    const minDistance = Math.min(...distances);
    const theSmallestIndex = distances.indexOf(minDistance);

    return linearPercent > positions[theSmallestIndex]
      ? distances.lastIndexOf(minDistance)
      : theSmallestIndex;
  }

  protected _findExactValue(
    newPercent: number,
    { findNearest = { currentPercent: NaN } } = {}
  ) {
    const intervalIndex = this._findIntervalIndex(newPercent);
    const stepValues = this._getStepValues(intervalIndex);
    let newValue = this._toValue(newPercent);

    if (stepValues === 'none') {
      return newValue;
    }

    stepValues.some((stepValue, index) => {
      const nextStepValue = stepValues[index + 1];
      const isValueBetweenStepValues =
        newValue >= stepValue && newValue <= nextStepValue;

      if (isValueBetweenStepValues) {
        if (Number.isNaN(findNearest.currentPercent)) {
          newValue = RangeSliderView._findNearestSteppedValue(
            newValue,
            stepValue,
            nextStepValue
          );
        } else {
          const currentValue = this._toValue(findNearest.currentPercent);

          newValue = RangeSliderView._findNewSteppedValue(
            currentValue,
            newValue,
            stepValue,
            nextStepValue
          );
        }

        return true;
      }

      return false;
    });

    return newValue;
  }

  protected _findIntervalIndex(percent: number) {
    const { intervals } = this._options;
    const intervalsKeys = Object.keys(intervals);
    const theLastIntervalIndex = intervalsKeys.length - 1;
    let intervalIndex = intervalsKeys.findIndex((intervalKey) => {
      const intervalPercent =
        RangeSliderView._getIntervalKeyAsNumber(intervalKey);

      return percent < intervalPercent;
    });

    intervalIndex = intervalIndex === -1 ? theLastIntervalIndex : intervalIndex;

    return intervalIndex - 1;
  }

  protected _getStepValues(intervalIndex: number) {
    const { intervals, steps } = this._options;
    const intervalsKeys = Object.keys(intervals);
    const step = steps[intervalIndex];

    if (step === 'none') {
      return step;
    }

    const [min, max] = [
      intervals[intervalsKeys[intervalIndex]],
      intervals[intervalsKeys[intervalIndex + 1]],
    ];

    const values: number[] = [];

    for (let currentValue = min; currentValue < max; currentValue += step) {
      values.push(currentValue);
    }

    values.push(max);

    return values;
  }

  protected _toPercent(value: number) {
    let offsetInPercent = 0;
    Object.entries(this._options.intervals).some(
      ([key, crossedValue], index, intervalsEntries) => {
        const [nextKey, nextValue] = intervalsEntries[index + 1];
        const [percent, nextPercent] = [
          RangeSliderView._getIntervalKeyAsNumber(key),
          RangeSliderView._getIntervalKeyAsNumber(nextKey),
        ];
        const intervalPercentSize = nextPercent - percent;

        const isValueBetweenIntervalValues =
          value >= crossedValue && value <= nextValue;

        if (isValueBetweenIntervalValues) {
          const intervalValueSize = nextValue - crossedValue;
          const valuePerPercentInInterval =
            intervalValueSize / intervalPercentSize;

          offsetInPercent += (value - crossedValue) / valuePerPercentInInterval;

          return true;
        }

        offsetInPercent += intervalPercentSize;

        return false;
      }
    );

    return offsetInPercent;
  }

  protected _toValue(percent: number) {
    let value = this._options.intervals.min;
    Object.entries(this._options.intervals).some(
      ([key, crossedValue], index, intervalsEntries) => {
        const [nextKey, nextValue] = intervalsEntries[index + 1];
        const [crossedPercent, nextPercent] = [
          RangeSliderView._getIntervalKeyAsNumber(key),
          RangeSliderView._getIntervalKeyAsNumber(nextKey),
        ];

        const intervalPercentSize = nextPercent - crossedPercent;
        const intervalValueSize = nextValue - crossedValue;
        const valuePerPercentInInterval =
          intervalValueSize / intervalPercentSize;

        const isPercentBetweenIntervalValuesPercents =
          percent >= crossedPercent && percent <= nextPercent;

        if (isPercentBetweenIntervalValuesPercents) {
          value += (percent - crossedPercent) * valuePerPercentInInterval;

          return true;
        }

        value += intervalPercentSize * valuePerPercentInInterval;

        return false;
      }
    );

    return value;
  }

  protected _getValueBorder() {
    const [leftPad, rightPad] = this._options.padding;

    return {
      min: this._options.intervals.min + leftPad,
      max: this._options.intervals.max - rightPad,
    };
  }
}

export { RangeSliderView as default };
