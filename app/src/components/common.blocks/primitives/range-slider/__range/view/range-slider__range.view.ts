import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

import './range-slider__range.scss';
import IRangeSliderRangeView, {
  RangeOptions,
  RangeState,
} from './range-slider__range.view.coupling';

const DEFAULT_OPTIONS: Required<RangeOptions> = {
  isConnected: false,
};

const DEFAULT_STATE: RangeState = {};

class RangeSliderRangeView
  extends MVPView<Required<RangeOptions>, RangeOptions, RangeState>
  implements IRangeSliderRangeView {
  readonly template = ({ classInfo = {}, styleInfo = {}, attributes = {} } = {}) =>
    html`<div
      class=${classMap({
        'range-slider__range': true,
        'js-range-slider__range': true,
        'range-slider__range_isConnected': this._options.isConnected,
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

export { RangeSliderRangeView as default, DEFAULT_OPTIONS, DEFAULT_STATE };
