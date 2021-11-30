import { html, TemplateResult } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import AbstractView from '@shared/utils/scripts/components/MVP/AbstractView';

import {
  TrackViewOptions,
  TrackViewState,
  TrackViewIsolatedEvents,
} from './types';
import './TrackView.scss';

class TrackView extends AbstractView<
  TrackViewOptions,
  TrackViewState,
  TrackViewIsolatedEvents
> {
  readonly template = (
    { classInfo = {}, styleInfo = {}, attributes = {} } = {},
    innerHTML: TemplateResult | TemplateResult[] = html``
  ) =>
    html`<div
      class=${classMap({
        'range-slider__track': true,
        'js-range-slider__track': true,
        [`range-slider__track_orientation_${this._options.orientation}`]: true,
        ...classInfo,
      })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    >
      ${innerHTML}
    </div>`;
}

export { TrackView as default };
