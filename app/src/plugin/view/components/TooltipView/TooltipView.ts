import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import AbstractView from '@shared/utils/scripts/components/MVP/AbstractView';

import {
  TooltipViewOptions,
  TooltipViewState,
  TooltipViewIsolatedEvents,
} from './types';
import './TooltipView.scss';

class TooltipView extends AbstractView<
  Required<TooltipViewOptions>,
  Required<TooltipViewState>,
  TooltipViewIsolatedEvents
> {
  readonly template = ({
    classInfo = {},
    styleInfo = {},
    attributes = {},
  } = {}) => html`<div
    class=${classMap({
      'range-slider__tooltip': true,
      [`range-slider__tooltip_orientation_${this._options.orientation}`]: true,
      'range-slider__tooltip_hidden': this._options.isHidden,
      ...classInfo,
    })}
    ...=${spread(attributes)}
    style=${styleMap({ ...styleInfo })}
  >
    ${this._options.formatter(this._state.value)}
  </div>`;
}

export { TooltipView as default };
