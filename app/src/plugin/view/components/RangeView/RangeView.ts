import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import AbstractView from '@shared/utils/scripts/components/MVP/AbstractView';

import {
  RangeViewOptions,
  RangeViewState,
  RangeViewIsolatedEvents,
} from './types';
import './RangeView.scss';

class RangeView extends AbstractView<
  Required<RangeViewOptions>,
  Required<RangeViewState>,
  RangeViewIsolatedEvents
> {
  readonly template = ({
    classInfo = {},
    styleInfo = {},
    attributes = {},
  } = {}) =>
    html`<div
      class=${classMap({
        'range-slider__range': true,
        'js-range-slider__range': true,
        'range-slider__range_connected': this._options.isConnected,
        ...classInfo,
      })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    ></div>`;
}

export { RangeView as default };
