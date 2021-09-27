import { html, TemplateResult } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import { MVPView } from '@utils/devTools/scripts/view/MVPHelper';

import IThumbView, { ThumbOptions, ThumbState } from './IThumbView';
import './ThumbView.scss';

const DEFAULT_OPTIONS: Required<ThumbOptions> = {};

const DEFAULT_STATE: ThumbState = {
  ariaOrientation: 'horizontal',
  ariaValueMin: -1,
  ariaValueMax: -1,
  ariaValueNow: -1,
  ariaValueText: '-1',
};

class ThumbView
  extends MVPView<Required<ThumbOptions>, ThumbOptions, ThumbState>
  implements IThumbView
{
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

  constructor(
    options: ThumbOptions = DEFAULT_OPTIONS,
    state: ThumbState = DEFAULT_STATE
  ) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {});
  }

  // eslint-disable-next-line class-methods-use-this
  protected _onDragstart() {
    return false;
  }
}

export { ThumbView as default, DEFAULT_OPTIONS, DEFAULT_STATE };