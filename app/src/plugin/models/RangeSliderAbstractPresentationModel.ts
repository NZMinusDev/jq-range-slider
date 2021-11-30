import defaultsDeep from 'lodash-es/defaultsDeep';

import AbstractPresentationModel from '@shared/utils/scripts/components/MVP/AbstractPresentationModel';

import {
  RangeSliderPresentationModelOptions,
  RangeSliderPresentationModelNormalizedOptions,
  RangeSliderPresentationModelState,
  IRangeSliderFacadeModel,
} from './types';
import { DEFAULT_OPTIONS, DEFAULT_STATE } from './constants';

abstract class RangeSliderAbstractPresentationModel extends AbstractPresentationModel<
  RangeSliderPresentationModelOptions,
  RangeSliderPresentationModelNormalizedOptions,
  RangeSliderPresentationModelState,
  IRangeSliderFacadeModel
> {
  protected _getIntervalsOption() {
    return { ...this._options.intervals };
  }

  protected _getStartOption() {
    return [...this._options.start];
  }

  protected _getStepsOption() {
    return [...this._options.steps];
  }

  protected _getConnectOption() {
    return [...this._options.connect];
  }

  protected _getOrientationOption() {
    return this._options.orientation;
  }

  protected _getPaddingOption() {
    return [...this._options.padding] as [number, number];
  }

  protected _getFormatterOption() {
    return this._options.formatter;
  }

  protected _getTooltipsOption() {
    return [...this._options.tooltips];
  }

  protected _getPipsOption() {
    return defaultsDeep({}, this._options.pips);
  }

  setOptions(options?: RangeSliderPresentationModelOptions) {
    const copy = this._state.thumbs.map((thumb) => ({ ...thumb }));

    // transition off
    this._state.thumbs.forEach((thumb, index) => {
      this._state.thumbs[index].isActive = true;
    });
    super.setOptions(options);
    copy.forEach((thumb, index) => {
      this._state.thumbs[index] = thumb;
    });

    return this;
  }

  protected _setIntervalsOption(
    intervals: RangeSliderPresentationModelOptions['intervals'] = DEFAULT_OPTIONS.intervals
  ) {
    this._options.intervals = { ...intervals };

    this._optionsShouldBeFixed.push('intervals', 'start', 'steps', 'pips');
    this._stateShouldBeFixed.push('value');

    return this;
  }

  protected _setStartOption(
    start: RangeSliderPresentationModelOptions['start'] = DEFAULT_OPTIONS.start
  ) {
    this._options.start = Array.isArray(start)
      ? [...start]
      : this._options.start.fill(start);

    this._optionsShouldBeFixed.push('start', 'connect', 'tooltips');
    this._stateShouldBeFixed.push('value', 'thumbs');

    return this;
  }

  protected _setStepsOption(
    steps: RangeSliderPresentationModelOptions['steps'] = DEFAULT_OPTIONS.steps
  ) {
    this._options.steps = Array.isArray(steps)
      ? [...steps]
      : this._options.steps.fill(steps);

    this._optionsShouldBeFixed.push('steps');

    return this;
  }

  protected _setConnectOption(
    connect: RangeSliderPresentationModelOptions['connect'] = DEFAULT_OPTIONS.connect
  ) {
    this._options.connect = Array.isArray(connect)
      ? [...connect]
      : this._options.connect.fill(connect);

    this._optionsShouldBeFixed.push('connect');

    return this;
  }

  protected _setOrientationOption(
    orientation: RangeSliderPresentationModelOptions['orientation'] = DEFAULT_OPTIONS.orientation
  ) {
    this._options.orientation = orientation;

    return this;
  }

  protected _setPaddingOption(
    padding: RangeSliderPresentationModelOptions['padding'] = DEFAULT_OPTIONS.padding
  ) {
    this._options.padding = Array.isArray(padding)
      ? ([
          ...padding,
        ] as RangeSliderPresentationModelNormalizedOptions['padding'])
      : this._options.padding.fill(padding);

    this._optionsShouldBeFixed.push('padding', 'start');
    this._stateShouldBeFixed.push('value');

    return this;
  }

  protected _setFormatterOption(
    formatter: RangeSliderPresentationModelOptions['formatter'] = DEFAULT_OPTIONS.formatter
  ) {
    this._options.formatter = formatter;

    this._optionsShouldBeFixed.push('tooltips');

    return this;
  }

  protected _setTooltipsOption(
    tooltips: RangeSliderPresentationModelOptions['tooltips'] = DEFAULT_OPTIONS.tooltips
  ) {
    this._options.tooltips = Array.isArray(tooltips)
      ? [...tooltips]
      : this._options.tooltips.fill(tooltips);

    this._optionsShouldBeFixed.push('tooltips');

    return this;
  }

  protected _setPipsOption(
    pips: RangeSliderPresentationModelOptions['pips'] = DEFAULT_OPTIONS.pips
  ) {
    this._options.pips = defaultsDeep({}, pips, this._options.pips);

    this._optionsShouldBeFixed.push('pips');

    return this;
  }

  protected _getValueState() {
    return [...this._state.value];
  }

  protected _getThumbsState() {
    return this._state.thumbs.map((thumb) => ({ ...thumb }));
  }

  protected _setValueState(
    value: RangeSliderPresentationModelState['value'] = this._options.start
  ) {
    this._state.value = [...value];

    this._stateShouldBeFixed.push('value', 'thumbs');

    return this;
  }

  protected _setThumbsState(
    thumbs: Partial<RangeSliderPresentationModelState>['thumbs'] = DEFAULT_STATE.thumbs
  ) {
    this._state.thumbs = thumbs.map((thumb) => ({ ...thumb }));

    this._stateShouldBeFixed.push('thumbs');

    return this;
  }

  protected abstract _fixIntervalsOption(): this;

  protected abstract _fixStartOption(): this;

  protected abstract _fixStepsOption(): this;

  protected abstract _fixConnectOption(): this;

  protected abstract _fixPaddingOption(): this;

  protected abstract _fixTooltipsOption(): this;

  protected abstract _fixPipsOption(): this;

  protected abstract _fixValueState(): this;

  protected abstract _fixThumbsState(): this;
}

export { RangeSliderAbstractPresentationModel as default };
