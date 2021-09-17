import defaultsDeep from 'lodash-es/defaultsDeep';
import { html } from 'lit-html';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import { MVPView } from '@utils/devTools/scripts/PluginCreationHelper';
import { collapsingParseInt } from '@utils/devTools/scripts/ParserHelper';

import IPipsView, { PipsOptions, PipsState } from './IPipsView';
import './PipsView.scss';

const DEFAULT_OPTIONS: Required<PipsOptions> = {
  orientation: 'horizontal',
  isHidden: false,
  values: [],
  density: 1,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};

const DEFAULT_STATE: PipsState = {};

class PipsView extends MVPView<Required<PipsOptions>, PipsOptions, PipsState> implements IPipsView {
  readonly template = ({ classInfo = {}, styleInfo = {}, attributes = {} } = {}) =>
    html`<div
      class=${classMap({
        'range-slider__pips': true,
        'js-range-slider__pips': true,
        // eslint-disable-next-line sonarjs/no-nested-template-literals
        [`range-slider__pips_orientation_${this._options.orientation}`]: true,
        'range-slider__pips_hidden': this._options.isHidden,
        ...classInfo,
      })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    >
      ${this._getPipsRender()}
    </div>`;

  constructor(options: PipsOptions = DEFAULT_OPTIONS, state: PipsState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ['isHidden', 'values', 'density', 'formatter'],
    });
  }

  getOrientationOption() {
    return this._options.orientation;
  }
  getIsHiddenOption() {
    return this._options.isHidden;
  }
  getValuesOption() {
    return [...this._options.values];
  }
  getDensityOption() {
    return this._options.density;
  }
  getFormatterOption() {
    return this._options.formatter;
  }

  setOrientationOption(orientation: PipsOptions['orientation'] = DEFAULT_OPTIONS.orientation) {
    this._options.orientation = orientation;

    return this;
  }
  setIsHiddenOption(isHidden: PipsOptions['isHidden'] = DEFAULT_OPTIONS.isHidden) {
    this._options.isHidden = isHidden;

    return this;
  }
  setValuesOption(values: PipsOptions['values'] = DEFAULT_OPTIONS.values) {
    this._options.values = defaultsDeep([], values);
    this._fixValuesOption();

    return this;
  }
  setDensityOption(density: PipsOptions['density'] = DEFAULT_OPTIONS.density) {
    this._options.density = density;
    this._fixDensityOption();

    return this;
  }
  setFormatterOption(formatter: PipsOptions['formatter'] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    return this;
  }

  protected _fixValuesOption() {
    this._options.values = this._options.values
      .filter((value) => value.percent >= 0 && value.percent <= 100)
      .sort((a, b) => a.percent - b.percent);

    return this;
  }
  protected _fixDensityOption() {
    this._options.density =
      this._options.density < 0 ? DEFAULT_OPTIONS.density : this._options.density;
    this._options.density = collapsingParseInt(`${this._options.density}`);

    return this;
  }

  protected _getPipsRender() {
    if (this._options.values.length < 1) {
      return html``;
    }

    const longMarkerClasses: ClassInfo = {
      'range-slider__pips-marker': true,
      'js-range-slider__pips-marker': true,
      'range-slider__pips-marker_size_long': true,
    };

    const positionKey = this._options.orientation === 'horizontal' ? 'left' : 'top';

    let valuePosition = 0;
    let rangeShift = this._options.values[0].percent;

    return this._options.values.map((value, index, values) => {
      const longMarkerStyles: StyleInfo = {
        [positionKey]: `${(valuePosition += rangeShift)}%`,
      };
      const longMarkerTemplate = html`<div
        class=${classMap(longMarkerClasses)}
        style=${styleMap(longMarkerStyles)}
      ></div>`;

      let markersTemplate;

      if (index > 0) {
        markersTemplate = this._getMarkersRender(valuePosition, rangeShift, positionKey);
      }

      const valueTemplate = this._getValueRender(longMarkerStyles, value.value);

      if (values[index + 1] !== undefined) {
        rangeShift = values[index + 1].percent - value.percent;
      }

      return html`${markersTemplate}${longMarkerTemplate}${valueTemplate}`;
    });
  }
  protected _getMarkersRender(end: number, range: number, positionKey: 'left' | 'top') {
    const classes: ClassInfo = {
      'range-slider__pips-marker': true,
      'js-range-slider__pips-marker': true,
    };

    const amount = Math.floor(range * this._options.density);
    const shift = 1 / this._options.density;
    const start = end - range;
    let position = start;

    return new Array(amount).fill(``).map(() => {
      position += shift;

      const markerStyles = {
        [positionKey]: `${position}%`,
      };

      return html`<div class=${classMap(classes)} style=${styleMap(markerStyles)}></div>`;
    });
  }
  protected _getValueRender(styleInfo: StyleInfo, value: number) {
    const valueClasses: ClassInfo = {
      'range-slider__pips-value': true,
      'js-range-slider__pips-value': true,
    };

    return html`<div
      class=${classMap(valueClasses)}
      style=${styleMap(styleInfo)}
      data-value=${value}
      data-formatted-value=${this._options.formatter(value)}
    ></div>`;
  }
}

export { PipsView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
