import { html, TemplateResult } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import AbstractView from '@shared/utils/scripts/components/MVP/AbstractView';

import {
  ThumbViewOptions,
  ThumbViewState,
  ThumbViewIsolatedEvents,
} from './types';
import './ThumbView.scss';

class ThumbView extends AbstractView<
  Required<ThumbViewOptions>,
  Required<ThumbViewState>,
  ThumbViewIsolatedEvents
> {
  protected static ariaAttributePrecision = 2;

  readonly template = (
    { classInfo = {}, styleInfo = {}, attributes = {} } = {},
    {
      innerHTML,
      isActive,
    }: { innerHTML: TemplateResult | TemplateResult[]; isActive: boolean } = {
      innerHTML: html``,
      isActive: false,
    }
  ) =>
    html`<div
      class=${classMap({
        'range-slider__thumb-origin': true,
        'js-range-slider__thumb-origin': true,
        [`range-slider__thumb-origin_orientation_${this._state.ariaOrientation}`]:
          true,
        'range-slider__thumb-origin_active': isActive,
        ...classInfo,
      })}
      ...=${spread(attributes)}
      style=${styleMap({ ...styleInfo })}
    >
      <div
        class=${classMap({
          'range-slider__thumb': true,
          'js-range-slider__thumb': true,
        })}
        role="slider"
        tabindex="0"
        aria-orientation="${this._state.ariaOrientation}"
        aria-valuemin="${this._state.ariaValueMin.toFixed(
          ThumbView.ariaAttributePrecision
        )}"
        aria-valuemax="${this._state.ariaValueMax.toFixed(
          ThumbView.ariaAttributePrecision
        )}"
        aria-valuenow="${this._state.ariaValueNow.toFixed(
          ThumbView.ariaAttributePrecision
        )}"
        aria-valuetext="${this._state.ariaValueText}"
        @dragstart=${this}
      >
        ${innerHTML}
      </div>
    </div>`;

  // eslint-disable-next-line class-methods-use-this
  protected onDragstart() {
    return false;
  }
}

export { ThumbView as default };
