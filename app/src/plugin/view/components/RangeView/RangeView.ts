import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import { MVPView } from '@utils/devTools/scripts/PluginCreationHelper';

import IRangeView, { RangeOptions, RangeState } from './IRangeView';
import './RangeView.scss';

const DEFAULT_OPTIONS: Required<RangeOptions> = {
  isConnected: false,
};

const DEFAULT_STATE: RangeState = {};

class RangeView
  extends MVPView<Required<RangeOptions>, RangeOptions, RangeState>
  implements IRangeView
{
  readonly template = ({ classInfo = {}, styleInfo = {}, attributes = {} } = {}) =>
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

  constructor(options: RangeOptions = DEFAULT_OPTIONS, state: RangeState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ['isConnected'],
    });
  }

  getIsConnectedOption() {
    return this._options.isConnected;
  }

  setIsConnectedOption(isConnected = DEFAULT_OPTIONS.isConnected) {
    this._options.isConnected = isConnected;

    return this;
  }
}

export { RangeView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
