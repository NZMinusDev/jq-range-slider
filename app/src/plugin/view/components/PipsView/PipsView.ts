import { html } from 'lit-html';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import AbstractView from '@shared/utils/scripts/components/MVP/AbstractView';
import { Unpacked } from '@shared/utils/scripts/TypingHelper';

import {
  PipsViewOptions,
  PipsViewState,
  PipsViewIsolatedEvents,
  PipsViewDOMEvents,
} from './types';

import './PipsView.scss';

class PipsView extends AbstractView<
  Required<PipsViewOptions>,
  Required<PipsViewState>,
  PipsViewIsolatedEvents
> {
  readonly template = ({
    classInfo = {},
    styleInfo = {},
    attributes = {},
  } = {}) =>
    html`<div
      class=${classMap({
        'range-slider__pips': true,
        'js-range-slider__pips': true,
        [`range-slider__pips_orientation_${this._options.orientation}`]: true,
        'range-slider__pips_hidden': this._options.isHidden,
        ...classInfo,
      })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    >
      ${this._getPipsRender()}
    </div>`;

  protected _getPipsRender() {
    if (this._options.values.length < 1) {
      return html``;
    }

    const longMarkerClasses: ClassInfo = {
      'range-slider__pips-marker': true,
      'js-range-slider__pips-marker': true,
      'range-slider__pips-marker_size_long': true,
    };

    const positionKey =
      this._options.orientation === 'horizontal' ? 'left' : 'top';

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
        markersTemplate = this._getMarkersRender(
          valuePosition,
          rangeShift,
          positionKey
        );
      }

      const valueTemplate = this._getValueRender(longMarkerStyles, value);

      if (values[index + 1] !== undefined) {
        rangeShift = values[index + 1].percent - value.percent;
      }

      return html`${markersTemplate}${longMarkerTemplate}${valueTemplate}`;
    });
  }

  protected _getMarkersRender(
    end: number,
    range: number,
    positionKey: 'left' | 'top'
  ) {
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

      return html`<div
        class=${classMap(classes)}
        style=${styleMap(markerStyles)}
      ></div>`;
    });
  }

  protected _getValueRender(
    styleInfo: StyleInfo,
    value: Unpacked<PipsViewOptions['values']>
  ) {
    const valueClasses: ClassInfo = {
      'range-slider__pips-value': true,
      'js-range-slider__pips-value': true,
    };

    return html`<div
      class=${classMap(valueClasses)}
      style=${styleMap(styleInfo)}
      @click=${this._valuePipEventListenerObject.handleValuePipClick.bind(
        this,
        value
      )}
      data-formatted-value=${this._options.formatter(value.value)}
    ></div>`;
  }

  protected _valuePipEventListenerObject = {
    handleValuePipClick: (
      value: Unpacked<PipsViewOptions['values']>,
      event: PipsViewDOMEvents['click']
    ) => {
      const theEvent = event;

      theEvent.data = { ...value };
    },
  };
}

export { PipsView as default };
